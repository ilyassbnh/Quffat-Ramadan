
const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyCvY8jQxl_5xS9-aar3JN3IaLLou16SPKI';

async function auditModels() {
    console.log('Auditing models for ' + apiKey.substring(0, 5) + '...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (!data.models) {
        console.error('No models found:', data);
        return;
    }

    const embedModels = data.models.filter((m: any) =>
        m.name.includes('embed') ||
        (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('embedContent'))
    );

    console.log('Found ' + embedModels.length + ' embedding-capable models:');

    for (const m of embedModels) {
        console.log(`\nName: ${m.name}`);
        console.log(`Methods: ${JSON.stringify(m.supportedGenerationMethods)}`);
        console.log(`Version: ${m.version}`);
    }
}

auditModels();
