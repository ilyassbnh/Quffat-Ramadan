
const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function testRestEmbedding() {
    console.log('Testing REST API for text-embedding-004...');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;

    const body = {
        model: "models/text-embedding-004",
        content: {
            parts: [{ text: "Hello world" }]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success!');
            console.log('Embedding length:', data.embedding?.values?.length);
        } else {
            console.error('❌ Error Body:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testRestEmbedding();
