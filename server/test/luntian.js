const { OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: "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",
});

const userQuestion = `give me 20 questions about agriculture?`;

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
