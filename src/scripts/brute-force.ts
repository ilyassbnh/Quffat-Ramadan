
const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function bruteForce() {
    console.log('Fetching model list...');

    try {
        const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await listResp.json();

        if (!data.models) {
            console.error('No models found.');
            return;
        }

        const candidates = data.models.filter((m: any) =>
            m.supportedGenerationMethods && m.supportedGenerationMethods.includes('embedContent')
        );

        console.log(`Found ${candidates.length} candidates. Testing each...`);

        for (const model of candidates) {
            process.stdout.write(`Testing ${model.name}... `);

            // Construct prompt
            const url = `https://generativelanguage.googleapis.com/v1beta/${model.name}:embedContent?key=${apiKey}`;
            const body = {
                model: model.name,
                content: { parts: [{ text: "test" }] }
            };

            try {
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (resp.ok) {
                    const resData = await resp.json();
                    if (resData.embedding) {
                        console.log('✅ SUCCESS!');
                        console.log('---------------------------------------------------');
                        console.log('WORKING MODEL NAME:', model.name);
                        console.log('DIMENSION:', resData.embedding.values.length);

                        const fs = require('fs');
                        fs.appendFileSync('working_models.log', `MODEL=${model.name} DIMENSION=${resData.embedding.values.length}\n`);

                        console.log('---------------------------------------------------');
                        // Continue searching for more models
                        // return; // Found one!
                    }
                } else {
                    console.log('❌ ' + resp.status);
                }
            } catch (e) {
                console.log('❌ Err');
            }
        }
        console.log('Done. No working models found.');

    } catch (error) {
        console.error('Fatal:', error);
    }
}

bruteForce();
