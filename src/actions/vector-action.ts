'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPineconeIndex } from '@/lib/pinecone';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });


import { z } from 'zod';
import { parsePDF, parseCSV } from '@/lib/parsers';

import * as xlsx from 'xlsx';

// Utility for delaying execution (helpers for rate limits if needed)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DocumentSchema = z.object({
    file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File size must be less than 5MB',
    }).refine((file) => ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type), {
        message: 'File type must be PDF, CSV or Excel (XLSX)',
    }),
});

export async function uploadDocument(formData: FormData) {
    try {
        const file = formData.get('file');

        // 1. Validate Input
        const validData = DocumentSchema.safeParse({ file });

        if (!validData.success) {
            return { success: false, error: validData.error.issues[0].message };
        }

        const validFile = validData.data.file;
        const buffer = Buffer.from(await validFile.arrayBuffer());
        let chunks: string[] = [];

        // 2. Process Content
        if (validFile.type === 'application/pdf') {
            const text = await parsePDF(buffer);
            chunks = text.match(/.{1,1000}/g) || [];
        } else if (validFile.type === 'text/csv' || validFile.type === 'application/vnd.ms-excel') {
            const text = await validFile.text();
            const rows = parseCSV<Record<string, unknown>>(text);
            chunks = processRows(rows);
        } else if (validFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // XLSX handling
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet);
            chunks = processRows(rows);
        }

        if (chunks.length === 0) {
            return { success: false, error: 'No content extracted from file' };
        }

        // Helper to process rows (shared between CSV and XLSX)
        function processRows(rows: Record<string, unknown>[]): string[] {
            return rows.map((row) => {
                const nom = row['Nom'] || row['nom'] || 'Inconnu';
                const quartier = row['Quartier'] || row['quartier'] || 'Inconnu';
                if (row['Nom'] && row['Quartier']) {
                    return `Famille ${nom} habite à ${quartier}. Détails: ${JSON.stringify(row)}`;
                }
                return Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', ');
            });
        }

        if (chunks.length === 0) {
            return { success: false, error: 'No content extracted from file' };
        }

        // 3. Generate Embeddings & Store
        const index = getPineconeIndex();

        // Process in batches of 10 to avoid rate limits/timeouts
        const batchSize = 10;

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            await Promise.all(batch.map(async (textChunk, batchIndex) => {
                if (!textChunk.trim()) return;

                const result = await model.embedContent(textChunk);
                const embedding = result.embedding.values;

                await index.upsert([
                    {
                        id: `${validFile.name}-${i + batchIndex}-${crypto.randomUUID()}`,
                        values: embedding,
                        metadata: {
                            filename: validFile.name,
                            type: validFile.type === 'application/pdf' ? 'pdf' : 'csv',
                            text: textChunk,
                            uploadedAt: new Date().toISOString()
                        },
                    },
                ] as any);
            }));
        }

        return { success: true, count: chunks.length };

    } catch (error) {
        console.error('SERVER ACTION ERROR:', error);
        if (error instanceof Error) {
            console.error('Stack:', error.stack);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown processing error' };
    }
}
