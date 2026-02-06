
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function testSDKNames() {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Test 1: plain name
    try {
        console.log('Testing "embedding-001"...');
        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const result = await model.embedContent("Hello world");
        console.log('✅ "embedding-001" worked! Length:', result.embedding.values.length);
    } catch (e) {
        console.log('❌ "embedding-001" failed:', e.message.substring(0, 100));
    }

    // Test 2: with prefix
    try {
        console.log('\nTesting "models/embedding-001"...');
        const model = genAI.getGenerativeModel({ model: 'models/embedding-001' });
        const result = await model.embedContent("Hello world");
        console.log('✅ "models/embedding-001" worked! Length:', result.embedding.values.length);
    } catch (e) {
        console.log('❌ "models/embedding-001" failed:', e.message.substring(0, 100));
    }
}

testSDKNames();
