/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Use a modern, available model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

async function run(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Return a user-friendly error message or re-throw the error
        return "Sorry, I couldn't process that. The model might be busy. Please try again later.";
    }
}

export default run;
