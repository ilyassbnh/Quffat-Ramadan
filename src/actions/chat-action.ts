'use server';

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

// Function to search for relevant documents in Pinecone
async function searchRelevantDocuments(query: string): Promise<string[]> {
    try {
        const indexName = process.env.PINECONE_INDEX_NAME || 'quffat-ramadan';
        const index = pc.index(indexName);

        console.log('[searchRelevantDocuments] Searching Pinecone for:', query);

        // Use Pinecone's integrated inference for search
        const results = await index.searchRecords({
            query: {
                topK: 5,
                inputs: { text: query },
            },
        });

        console.log('[searchRelevantDocuments] Found results:', results.result?.hits?.length || 0);

        if (!results.result?.hits || results.result.hits.length === 0) {
            return [];
        }

        // Extract text content from results
        const contexts = results.result.hits
            .filter((hit: any) => hit.fields?.text)
            .map((hit: any) => hit.fields.text as string);

        console.log('[searchRelevantDocuments] Extracted contexts:', contexts.length);
        return contexts;
    } catch (error) {
        console.error('[searchRelevantDocuments] Error:', error);
        return [];
    }
}

export async function chatAction(message: string) {
    console.log('[chatAction] Starting with message:', message);

    if (!process.env.GOOGLE_API_KEY) {
        console.error('[chatAction] GOOGLE_API_KEY is not defined');
        throw new Error('GOOGLE_API_KEY is not defined');
    }

    console.log('[chatAction] API key present');

    try {
        // Step 1: Search Pinecone for relevant documents
        console.log('[chatAction] Searching for relevant documents...');
        const relevantDocs = await searchRelevantDocuments(message);

        // Step 2: Build the context from retrieved documents
        let contextSection = '';
        if (relevantDocs.length > 0) {
            contextSection = `

## Documents indexés pertinents:
${relevantDocs.map((doc, i) => `[Document ${i + 1}]:\n${doc}`).join('\n\n')}

---
Utilise les informations ci-dessus pour répondre à la question de l'utilisateur. Si l'information n'est pas dans les documents, dis-le clairement.`;
            console.log('[chatAction] Added context from', relevantDocs.length, 'documents');
        } else {
            console.log('[chatAction] No relevant documents found');
        }

        // Step 3: Create the prompt with RAG context
        const systemPrompt = `Tu es l'assistant Sadaqa pour le projet Casa Ramadan 2026. Tu aides les utilisateurs à trouver des informations sur les familles, les dons et l'inventaire.

Réponds toujours dans la même langue que l'utilisateur (français par défaut).
Sois concis et précis dans tes réponses.
${contextSection}`;

        console.log('[chatAction] Creating streamText request...');

        const result = streamText({
            model: google('gemini-flash-latest'),
            system: systemPrompt,
            messages: [{ role: 'user', content: message }],
        });

        console.log('[chatAction] streamText created, returning response...');

        // AI SDK v6: Return the response for streaming
        const response = result.toUIMessageStreamResponse();

        console.log('[chatAction] Response created successfully');
        return response;
    } catch (error: any) {
        console.error('[chatAction] CRITICAL ERROR:', error);
        console.error('[chatAction] Error name:', error.name);
        console.error('[chatAction] Error message:', error.message);
        if (error.cause) {
            console.error('[chatAction] Error cause:', error.cause);
        }
        throw error;
    }
}
