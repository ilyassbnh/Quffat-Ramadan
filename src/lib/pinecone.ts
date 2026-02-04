import { Pinecone } from '@pinecone-database/pinecone';

// Pinecone client initialized lazily
let pinecone: Pinecone | null = null;

export const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'casa-ramadan-2026';

export const getPineconeIndex = () => {
    if (!process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_API_KEY is not defined');
    }

    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }

    return pinecone.index(INDEX_NAME);
};
