
import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY || 'pcsk_3dM6MN_JqT7a2bntLLVeNJN6sENGbEPPLsD4dGiaosvdQFNikbyQ38PiVtEL2HFNaFFnMw';
const indexName = process.env.PINECONE_INDEX_NAME || 'quffat-ramadan';

async function checkIndex() {
    console.log(`Checking index: ${indexName}...`);
    try {
        const pc = new Pinecone({ apiKey });
        const description = await pc.describeIndex(indexName);
        console.log('Index Description:', JSON.stringify(description, null, 2));

        console.log('\n--- Analysis ---');
        console.log(`Index Name: ${description.name}`);
        console.log(`Index Dimension: ${description.dimension}`);
        console.log(`Index Host: ${description.host}`);
    } catch (error) {
        console.error('❌ Error describing index:', error);
    }
}

checkIndex();
