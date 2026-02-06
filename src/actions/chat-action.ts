'use server';

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function chatAction(message: string) {
    console.log('[chatAction] Starting with message:', message);

    if (!process.env.GOOGLE_API_KEY) {
        console.error('[chatAction] GOOGLE_API_KEY is not defined');
        throw new Error('GOOGLE_API_KEY is not defined');
    }

    console.log('[chatAction] API key present, length:', process.env.GOOGLE_API_KEY.length);

    try {
        // Simple test - just respond without RAG for now
        console.log('[chatAction] Creating streamText request...');

        const result = streamText({
            model: google('gemini-1.5-flash'),
            system: 'You are a helpful assistant for the Casa Ramadan 2026 project.',
            messages: [{ role: 'user', content: message }],
        });

        console.log('[chatAction] streamText created, getting response...');

        // AI SDK v6: Return the response for streaming
        const response = result.toUIMessageStreamResponse();

        return response;
    } catch (error) {
        console.error('[chatAction] Error:', error);
        throw error;
    }
}
