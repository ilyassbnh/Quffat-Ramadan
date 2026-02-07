"use server";

import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractText } from "unpdf";
import * as XLSX from "xlsx";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (!apiKey) {
        console.error("❌ NO API KEY FOUND");
        return { error: "Configuration Error: API Key manquante" };
    }
    console.log(`[uploadFile] Using API Key: ${apiKey.substring(0, 5)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);

    if (!file) {
        return { error: "Aucun fichier fourni" };
    }

    try {
        let chunks: string[] = [];
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (file.type === "application/pdf") {
            try {
                const { text: rawText } = await extractText(new Uint8Array(buffer), { mergePages: true });
                const text = Array.isArray(rawText) ? rawText.join("\n") : (rawText || "");

                if (!text || text.trim().length === 0) {
                    return { error: "Le PDF est vide ou illisible." };
                }
                chunks = text.split(/\n\s*\n/).filter((chunk: string) => chunk.trim().length > 50);
            } catch (pdfErr) {
                console.error("PDF Parsing Error:", pdfErr);
                return { error: "Erreur lors de la lecture du PDF. Est-il protégé par mot de passe ?" };
            }
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel" ||
            file.type === "text/csv"
        ) {
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

            if (jsonData.length === 0) {
                return { error: "Le fichier Excel est vide." };
            }

            chunks = jsonData.map((row) => {
                const rowContent = Object.entries(row)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
                return `Registre: ${rowContent}`;
            });
        }

        if (chunks.length === 0) {
            return { error: "Aucun segment n'a pu être extrait." };
        }

        const metaModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const index = pc.index(process.env.PINECONE_INDEX_NAME || "quffat-ramadan");

        // Global Metadata Extraction using Gemini
        const docSummary = chunks.slice(0, 10).join("\n").substring(0, 3000);
        const metaPrompt = `Analyse ce document d'association. 
        Extrais: quartier, besoin_principal, priorite. 
        Texte: "${docSummary}"
        Réponds UNIQUEMENT en JSON: {"neighborhood": "...", "need": "...", "status": "..."}`;

        let globalMetadata = { neighborhood: "Casablanca", need: "Sadaqa", status: "Standard" };
        try {
            const metaResult = await metaModel.generateContent(metaPrompt);
            const metaText = metaResult.response.text();
            const cleanedJson = metaText.replace(/```json|```/g, "").trim();
            const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                globalMetadata = JSON.parse(jsonMatch[0]);
            } else {
                globalMetadata = JSON.parse(cleanedJson);
            }
        } catch (e) {
            console.warn("Metadata extraction failed, using defaults.");
        }

        const limitedChunks = chunks.slice(0, 100);

        // Use Pinecone's integrated embeddings (llama-text-embed-v2)
        // The index auto-generates 768-dim embeddings from the 'text' field
        const records = limitedChunks.map((chunk, idx) => ({
            _id: `doc-${Date.now()}-${idx}-${Math.random().toString(36).substring(7)}`,
            text: chunk,
            category: "famille",
            source: file.name,
            ...globalMetadata
        }));

        console.log(`[uploadFile] Upserting ${records.length} records with integrated embeddings...`);

        // Pass records array directly to upsertRecords for integrated embeddings
        await index.upsertRecords(records);

        console.log(`[uploadFile] Successfully indexed ${records.length} segments`);
        return { success: true, message: `${records.length} segments indexés.` };
    } catch (error: any) {
        console.error("Vector Action Error:", error);
        return { error: `Échec: ${error.message}` };
    }
}