const { OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: "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",
});

const userQuestion = `anthracnose`;

async function getPlantDiseaseResponse(question) {
  const messages = [
    {
      role: "system",
      content: `You are Luntian, an assistant designed to support users in understanding and managing plant diseases. Provide a response strictly in JSON format with the following fields:
        {
          "diseaseDescription": "single string",
          "plantsAffected": ["array", "of", "strings"],
          "causesAndRiskFactors": ["array", "of", "strings"],
          "treatmentAndManagement": ["array", "of", "strings"],
          "importantNotes": "single string"
        }
      Example format:
      {
        "diseaseDescription": "A brief description of the disease.",
        "plantsAffected": ["Plant1", "Plant2"],
        "causesAndRiskFactors": ["Cause1", "Cause2"],
        "treatmentAndManagement": ["Treatment1", "Treatment2"],
        "importantNotes": "Some important notes about the disease."
      }
      Ensure that the response strictly follows this format.`,
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

getPlantDiseaseResponse(userQuestion);
