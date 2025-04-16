const { OpenAI } = require("openai");

// Use Groq API base and your API key
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: "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",
});

const userQuestion = `who are you ?`;

async function getProgrammingResponse(question) {
  const messages = [
    {
      role: "system",
      content:
        "You are Calculara, an expert in Accounting with in-depth knowledge of ledgers, entries, amounts, journal, receipts, payment, etc.. Please provide detailed, accurate, and helpful responses",
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
