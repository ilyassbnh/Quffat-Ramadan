
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function listModels() {
    console.log('Listing available models...');
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Not all SDK versions expose listModels directly on client, 
        // but we can try to get it via the ModelManager or assume basic access.
        // Actually, the JS SDK doesn't have a simple listModels() on the top level class in all versions.
        // Let's try the direct REST API approach to be sure.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('Body:', text);
            return;
        }

        const data = await response.json();
        console.log('Models found:', data.models?.length);
        const set = data.models?.filter((m: any) => m.name.includes('embed')).map((m: any) => m.name);
        console.log('Embedding Models:', JSON.stringify(set, null, 2));

    } catch (error) {
        console.error('❌ Error listing models:', error);
    }
}

listModels();
