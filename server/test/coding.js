const { OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1", // Correct this URL if necessary
  apiKey: "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", // Keep this private
});

const userQuestion = `i know DRY in coding principle but what is KISS and SOLID?`;

async function getProgrammingResponse(question) {
  const messages = [
    {
      role: "system",
      content:
        "You are ELARA, an expert in computer programming with extensive knowledge across various languages, frameworks, and software development practices. Your role is to provide users with in-depth, accurate, and practical advice, offering tailored insights to help optimize coding and development workflows. Whether the question involves debugging, software architecture, algorithm design, or best practices in coding, your responses will be detailed and grounded in the latest programming standards and technologies.",
    },
    {
      role: "user",
      content: question,
    },
  ];

  const model = "llama3-70b-8192"; // Check if this model name is correct

  const startTime = Date.now(); // Track start time

  try {
    const res = await openai.chat.completions.create({
      model,
      messages,
    });

    const endTime = Date.now(); // Track end time
    const elapsedTime = (endTime - startTime) / 1000; // Time in seconds

    console.log("✅ Response:\n", res.choices[0].message.content);
    logTokenUsage(res);

    // Calculate Tokens per Second (T/s)
    const totalTokens = res.usage ? res.usage.total_tokens : 0;
    if (totalTokens > 0 && elapsedTime > 0) {
      const tokensPerSecond = totalTokens / elapsedTime;
      console.log(`🕒 Tokens per second: ${tokensPerSecond.toFixed(2)} T/s`);
    }

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
