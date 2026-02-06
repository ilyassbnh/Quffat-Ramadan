
import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY || 'pcsk_3dM6MN_JqT7a2bntLLVeNJN6sENGbEPPLsD4dGiaosvdQFNikbyQ38PiVtEL2HFNaFFnMw';

async function listIndexes() {
    console.log('Listing Pinecone indexes...');
    try {
        const pc = new Pinecone({ apiKey });
        const indexes = await pc.listIndexes();
        console.log('Indexes found:', JSON.stringify(indexes, null, 2));

        // Check specific index details if possible
        if (indexes.indexes && indexes.indexes.length > 0) {
            for (const idx of indexes.indexes) {
                try {
                    const desc = await pc.describeIndex(idx.name);
                    console.log(`\nIndex: ${idx.name}`);
                    console.log(`Dimension: ${desc.dimension}`);
                    console.log(`Host: ${desc.host}`);
                } catch (e) {
                    console.error(`Could not describe ${idx.name}:`, e);
                }
            }
        }

    } catch (error) {
        console.error('❌ Error listing indexes:', error);
    }
}

listIndexes();
