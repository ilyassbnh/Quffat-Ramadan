'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPineconeIndex } from '@/lib/pinecone';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export async function embedAndStoreDocs(text: string) {
    try {
        // 1. Generate Embedding
        const result = await model.embedContent(text);
        const embedding = result.embedding.values;

        // 2. Prepare Metadata
        const metadata = {
            text: text,
            createdAt: new Date().toISOString(),
        };

        // 3. Upsert to Pinecone
        const index = getPineconeIndex();
        await index.upsert([
            {
                id: crypto.randomUUID(),
                values: embedding,
                metadata: metadata,
            },
        ]);

        return { success: true };
    } catch (error) {
        console.error('Error embedding and storing docs:', error);
        return { success: false, error: 'Failed to embed and store document' };
    }
}
