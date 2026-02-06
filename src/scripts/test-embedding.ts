
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function testEmbedding() {
    console.log('Using API Key length:', apiKey.length);
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        'text-embedding-004',
        'models/text-embedding-004',
        'embedding-001'
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n--- Testing ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.embedContent("Hello world");
            console.log(`✅ Success! Dimension: ${result.embedding.values.length}`);
            return; // Stop on first success
        } catch (error) {
            console.error(`❌ Failed: ${error.message || error}`);
        }
    }
}

testEmbedding();
