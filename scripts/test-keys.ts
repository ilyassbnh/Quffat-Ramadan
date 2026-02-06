import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs';
import path from 'path';

// Manually load .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim();
        }
    });
} catch (e) {
    console.warn('⚠️ Could not load .env.local');
}

async function testKeys() {
    console.log('--- STARTING KEYS DIAGNOSTIC ---');

    // 1. Check Google Gemini API Key
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!googleKey) {
        console.error('❌ GOOGLE_API_KEY is missing from environment.');
    } else {
        const sourceVar = process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'GOOGLE_GENERATIVE_AI_API_KEY' : 'GOOGLE_API_KEY';
        console.log(`✅ Google Key found in ${sourceVar} (starts with ${googleKey.substring(0, 10)}...)`);
        try {
            const genAI = new GoogleGenerativeAI(googleKey);
            // Try to list model (best way to check auth) purely via a simple generation
            // Note: listModels is not always exposed in all SDK versions simpler to just try generate
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            await model.generateContent('ping');
            console.log('✅ Google API Key is VALID (Generation successful)');

            // Test Embedding Model Availability
            console.log('... Testing Embedding Models ...');

            try {
                const embedModel004 = genAI.getGenerativeModel({ model: 'models/text-embedding-004' });
                await embedModel004.embedContent("test");
                console.log('✅ Model "models/text-embedding-004" is AVAILABLE.');
            } catch (e: any) {
                console.error(`❌ Model "models/text-embedding-004" FAILED: ${e.message}`);
            }

            try {
                const embedModel001 = genAI.getGenerativeModel({ model: 'models/embedding-001' });
                await embedModel001.embedContent("test");
                console.log('✅ Model "models/embedding-001" is AVAILABLE.');
            } catch (e: any) {
                console.error(`❌ Model "models/embedding-001" FAILED: ${e.message}`);
            }

        } catch (error: any) {
            console.error('❌ Google API Key is INVALID or Quota Exceeded:', error.message);
        }
    }

    console.log('--------------------------------');

    // 2. Check Pinecone API Key
    const pineconeKey = process.env.PINECONE_API_KEY;
    if (!pineconeKey) {
        console.error('❌ PINECONE_API_KEY is missing.');
    } else {
        console.log(`✅ Pinecone Key found (starts with ${pineconeKey.substring(0, 5)}...)`);
        try {
            const pc = new Pinecone({ apiKey: pineconeKey });
            const indexes = await pc.listIndexes();
            console.log('✅ Pinecone API Key is VALID.');
            console.log('   Available Indexes:', indexes.indexes?.map(i => `${i.name} (${i.dimension} dim)`).join(', '));
        } catch (error: any) {
            console.error('❌ Pinecone API Key is INVALID:', error.message);
        }
    }

    console.log('--- DIAGNOSTIC COMPLETE ---');
}

testKeys();
