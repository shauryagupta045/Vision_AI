/*
 * Install the Google GenAI SDK
 *
 * $ npm install @google/genai
 */

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `VITE_GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function run(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Return a user-friendly error message or re-throw the error
        return "Sorry, I couldn't process that. The model might be busy. Please try again later.";
    }
}

export default run;
