import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not defined');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const INDEX_NAME = 'casa-ramadan-2026';

export const getPineconeIndex = () => {
    return pinecone.index(INDEX_NAME);
};
