// require("dotenv").config();

require("dotenv").config({ path: "../.env" }); // adjust path based on your structure
const { OpenAI } = require("openai");
const axios = require("axios");

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
    const res = await openai.chat.completions.create({
      model,
      messages,
    });

    console.log("✅ Response:\n", res.choices[0].message.content);
    logTokenUsage(res);
  } catch (error) {
    console.error("❌ Request failed:", error.message);
  }
}

function logTokenUsage(res) {
  if (res.usage) {
    const { prompt_tokens, completion_tokens, total_tokens } = res.usage;
    console.log("\n🔍 Token Usage:");
    console.log("Prompt tokens (input):", prompt_tokens);
    console.log("Completion tokens (output):", completion_tokens);
    console.log("Total tokens:", total_tokens);
  } else {
    console.log("\n⚠️ Token usage data not available in the response.");
  }
}

getProgrammingResponse(userQuestion);
