import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const askAi = async (messages) => {
  try {
    if (!messages || messages.length === 0) {
      throw new Error("Messages not found");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not found in .env");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:  "openrouter/free",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AI Interview App",
        },
        timeout: 60000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI returned empty response");
    }

    return content;
  } catch (error) {
    console.error("========= OPENROUTER ERROR =========");
    console.error("Status:", error.response?.status);
    console.error(
      "Response:",
      JSON.stringify(error.response?.data, null, 2)
    );
    console.error("Message:", error.message);
    console.error("===================================");

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "OpenRouter API Error"
    );
  }
};