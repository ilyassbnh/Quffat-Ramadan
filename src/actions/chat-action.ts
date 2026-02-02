'use server';

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPineconeIndex } from '@/lib/pinecone';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export async function chatAction(message: string) {
    // 1. Vectorize the user message
    const embeddingResult = await embeddingModel.embedContent(message);
    const embedding = embeddingResult.embedding.values;

    // 2. Query Pinecone for similar contexts
    const index = getPineconeIndex();
    const queryResponse = await index.query({
        vector: embedding,
        topK: 3,
        includeMetadata: true,
    });

    const contexts = queryResponse.matches
        .map((match) => match.metadata?.text)
        .filter(Boolean)
        .join('\n\n');

    // 3. Construct System Prompt
    const systemPrompt = `You are a helpful assistant for the Casa Ramadan 2026 project.
  Use the following context to answer the user's question.
  If the context doesn't contain the answer, say you don't know, but try to be helpful based on general knowledge if appropriate, but clarify it's not from the context.
  
  CONTEXT:
  ${contexts}
  `;

    // 4. Generate Stream with Gemini Flash
    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
    });

    return result.toDataStreamResponse();
}
