import { GoogleGenerativeAI } from "@google/generative-ai";

async function testEmbedding() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || "";
    console.log(`Testing API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);

    if (!apiKey) {
        console.error("❌ No API key found in environment variables");
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

    try {
        console.log("🔄 Testing embedding with text-embedding-004...");
        const res = await embedModel.embedContent({
            content: { parts: [{ text: "Test embedding" }] },
            taskType: "RETRIEVAL_DOCUMENT",
            // @ts-ignore
            outputDimensionality: 768
        });

        console.log("✅ Success! Embedding dimensions:", res.embedding.values.length);
        console.log("First 5 values:", res.embedding.values.slice(0, 5));
    } catch (error: any) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

testEmbedding();
