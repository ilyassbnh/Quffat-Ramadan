
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function testTruncation() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-embedding-001' });

    console.log('Testing outputDimensionality: 768...');

    try {
        const result = await model.embedContent({
            content: { role: 'user', parts: [{ text: "Hello world" }] },
            // @ts-ignore - outputDimensionality might not be in types yet
            outputDimensionality: 768
        });

        const fs = require('fs');
        fs.writeFileSync('truncation_test.log', `SUCCESS DIMENSION=${result.embedding.values.length}`);
        console.log('✅ Success! Dimension:', result.embedding.values.length);
    } catch (error) {
        const fs = require('fs');
        const msg = error instanceof Error ? error.message : String(error);
        fs.writeFileSync('truncation_test.log', `FAILED MSG=${msg}`);
        console.log('❌ Failed:', msg);
    }
}

testTruncation();
