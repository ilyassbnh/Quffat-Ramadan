
import { Pinecone } from '@pinecone-database/pinecone';

import fs from 'fs';
import path from 'path';

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !key.startsWith('#')) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });
}

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME || 'quffat-ramadan';

if (!apiKey) {
    console.error('❌ PINECONE_API_KEY is missing in .env.local');
    process.exit(1);
}

const pc = new Pinecone({ apiKey });

async function createIndex() {
    console.log(`Checking indexes...`);
    const separator = '-'.repeat(30);

    try {
        const indexes = await pc.listIndexes();
        console.log('Existing indexes:', indexes.indexes?.map(i => `${i.name} (${i.dimension})`).join(', ') || 'None');

        // Check if exists
        const exists = indexes.indexes?.find(i => i.name === indexName);
        if (exists) {
            console.log(`⚠️ Index "${indexName}" already exists with dimension ${exists.dimension}.`);
            console.log(`Please DELETE it manually in the dashboard if you want to recreate it with 3072.`);
            return;
        }

        console.log(separator);
        console.log(`Attempting to create index "${indexName}" with 3072 dimensions...`);

        // Try creating with serverless spec (standard for new free/starter accounts)
        await pc.createIndex({
            name: indexName,
            dimension: 3072, // The target dimension
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });

        console.log(`✅ SUCCESS! Index "${indexName}" created with 3072 dimensions.`);
        console.log(`You can now proceed with uploading files.`);

    } catch (error) {
        console.error('❌ Failed to create index:', error.message);
        if (error.message.includes('400')) {
            console.log('Tip: You might be on a starter plan that forces a specific cloud/region. Check your dashboard.');
        }
    }
}

createIndex();
