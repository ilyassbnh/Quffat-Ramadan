
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function testEmbedding() {
    console.log('Testing specific model: models/embedding-001');
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'models/embedding-001' });

        console.log('Generating embedding for "Hello world"...');
        const result = await model.embedContent("Hello world");

        console.log('✅ Success! Dimension:', result.embedding.values.length);
    } catch (error) {
        console.error('❌ Failed:', error);
    }
}

testEmbedding();
