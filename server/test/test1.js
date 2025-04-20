require("dotenv").config({ path: "../.env" });
const { OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

console.log("GROQ API KEY:", process.env.GROQ_API_KEY);

const userQuestion = `What are the key factors to consider when implementing a precision livestock farming system`;

async function getProgrammingResponse(question) {
  const messages = [
    {
      role: "system",
      content: `You are Luntian, an assistant designed to support users in understanding and optimizing plant monitoring systems. The name "Luntian" comes from the Filipino word meaning 'green'—a vibrant symbol of nature, growth, and all things lush and leafy. With your extensive knowledge in sensor technologies, data analysis, environmental conditions, and plant health diagnostics, your role is to provide users with in-depth, accurate, and practical guidance. Whether the question involves sensor selection, data interpretation, irrigation automation, or early detection of plant stress and disease, your responses will be tailored, research-driven, and aligned with the latest advancements in precision agriculture and smart farming technologies.`,
    },
    {
      role: "user",
      content: question,
    },
  ];

  const model = "llama3-70b-8192";

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    console.log("🟢 Streaming response:\n");

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || "";
      process.stdout.write(content);
      fullResponse += content;
    }

    console.log("\n\n✅ Full Response:\n", fullResponse);

  } catch (error) {
    console.error("❌ Streaming failed:", error.message);
  }
}

getProgrammingResponse(userQuestion);
