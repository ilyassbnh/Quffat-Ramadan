
import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = 'pcsk_3dM6MN_JqT7a2bntLLVeNJN6sENGbEPPLsD4dGiaosvdQFNikbyQ38PiVtEL2HFNaFFnMw';

async function verifyConnection() {
    console.log('Testing Pinecone connection...');
    try {
        const pc = new Pinecone({ apiKey });
        const indexes = await pc.listIndexes();
        console.log('✅ Connection Successful!');
        console.log('Indexes found:', indexes);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
    }
}

verifyConnection();
