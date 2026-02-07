require('dotenv').config({ path: '.env.local' });
const { Pinecone } = require('@pinecone-database/pinecone');

async function checkIndex() {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const indexName = process.env.PINECONE_INDEX_NAME || 'quffat-ramadan';

    console.log('Checking Pinecone index:', indexName);

    try {
        const indexInfo = await pc.describeIndex(indexName);
        console.log('Index info:', JSON.stringify(indexInfo, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkIndex();
