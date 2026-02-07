require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const key = process.env.GOOGLE_API_KEY;
    console.log('API Key (first 10 chars):', key?.substring(0, 10) || 'NOT FOUND');

    if (!key) {
        console.error('❌ No API key found');
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    try {
        console.log('Testing embedding...');
        const res = await model.embedContent({
            content: { parts: [{ text: "Test embedding" }] }
        });
        console.log('✅ Success! Dimensions:', res.embedding.values.length);
    } catch (e) {
        console.error('❌ Error:', e.message);
    }
}

test();
