
const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function testRestV1() {
    console.log('Testing REST v1 for embedding-001...');

    const url = `https://generativelanguage.googleapis.com/v1/models/embedding-001:embedContent?key=${apiKey}`;

    const body = {
        model: "models/embedding-001",
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
            console.log('✅ Success v1!');
            console.log('Embedding length:', data.embedding?.values?.length);
        } else {
            console.error('❌ Error Body:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testRestV1();
