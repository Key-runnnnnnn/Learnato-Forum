import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini AI
const initializeGemini = () => {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

// Find similar questions based on title and content
export const findSimilarQuestions = async (
  title: string,
  content: string,
  existingPosts: any[]
) => {
  try {
    if (!API_KEY) {
      console.warn("Gemini API key not configured");
      return [];
    }

    const ai = initializeGemini();
    if (!ai) return [];

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Given this new question:
Title: "${title}"
Content: "${content}"

And these existing questions:
${existingPosts
  .slice(0, 10)
  .map((post, idx) => `${idx + 1}. ${post.title}`)
  .join("\n")}

Find and return ONLY the numbers (1-${Math.min(
      10,
      existingPosts.length
    )}) of the top 3 most similar questions, separated by commas. If no similar questions exist, return "none". Reply with ONLY the numbers or "none", nothing else.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    if (response.toLowerCase() === "none") {
      return [];
    }

    const indices = response
      .split(",")
      .map((num) => parseInt(num.trim()) - 1)
      .filter((idx) => !isNaN(idx) && idx >= 0 && idx < existingPosts.length);

    return indices.map((idx) => existingPosts[idx]);
  } catch (error) {
    console.error("Error finding similar questions:", error);
    return [];
  }
};

// Summarize a discussion thread
export const summarizeDiscussion = async (
  postTitle: string,
  postContent: string,
  replies: any[]
) => {
  try {
    if (!API_KEY) {
      console.error("Gemini API key not configured");
      throw new Error(
        "Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file."
      );
    }

    if (replies.length === 0) {
      throw new Error("No replies to summarize");
    }

    const ai = initializeGemini();
    if (!ai) {
      throw new Error("Failed to initialize Gemini AI");
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const repliesText = replies
      .map(
        (reply, idx) => `Reply ${idx + 1} by ${reply.author}: ${reply.content}`
      )
      .join("\n\n");

    const prompt = `Summarize this discussion thread in 2-3 sentences:

Question: ${postTitle}
Details: ${postContent}

Replies:
${repliesText}

Provide a concise summary of the main points and solutions discussed.`;

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      throw new Error("No response from Gemini API");
    }

    const summary = result.response.text().trim();
    console.log("Summary generated successfully");

    if (!summary) {
      throw new Error("Empty summary received from API");
    }

    return summary;
  } catch (error: any) {
    console.error("Error summarizing discussion:", error);
    console.error("Error details:", error.message || error);
    throw error;
  }
};

// Get AI suggestions for a question
export const getAISuggestions = async (title: string, content: string) => {
  try {
    if (!API_KEY) {
      console.warn("Gemini API key not configured");
      return null;
    }

    const ai = initializeGemini();
    if (!ai) return null;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Given this technical question:
Title: "${title}"
Content: "${content}"

Provide 3 brief, helpful suggestions or tips to help answer this question. Keep each suggestion to 1-2 sentences. Format as a simple list.`;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text().trim();

    return suggestions;
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return null;
  }
};

export default {
  findSimilarQuestions,
  summarizeDiscussion,
  getAISuggestions,
};
