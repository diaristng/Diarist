import { GoogleGenAI, Type } from "@google/genai";
import { AdCopy } from '../types';

// Initialize the client. API_KEY is expected in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the ad copy, color palette, and image prompt based on user input.
 */
export const generateAdCopy = async (
  productDescription: string,
  productUrl: string
): Promise<AdCopy> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert digital marketing designer. 
    Create a high-converting ad campaign for the following product:
    Description: "${productDescription}"
    URL: "${productUrl}"

    I need a catchy headline, a persuasive subheadline, a short CTA, a cohesive color palette (hex codes), and a detailed prompt for an AI image generator to create a stunning background image for this ad.
    
    The image prompt should describe a professional product photography style background or an abstract background that fits the brand mood. It should NOT contain text. It should have some negative space.
    
    The colors should ensure high contrast for readability.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "Main catchy header, max 25 chars" },
          subheadline: { type: Type.STRING, description: "Supporting text, max 60 chars" },
          cta: { type: Type.STRING, description: "Button text, e.g., Shop Now" },
          imagePrompt: { type: Type.STRING, description: "Prompt for background image generation" },
          colors: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING, description: "Main brand color hex" },
              secondary: { type: Type.STRING, description: "Secondary accent hex" },
              background: { type: Type.STRING, description: "Fallback background hex" },
              text: { type: Type.STRING, description: "Main text color hex (high contrast)" },
              buttonText: { type: Type.STRING, description: "Text color for the button" },
            },
            required: ["primary", "secondary", "background", "text", "buttonText"],
          },
        },
        required: ["headline", "subheadline", "cta", "imagePrompt", "colors"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate ad copy.");
  }

  return JSON.parse(response.text) as AdCopy;
};

/**
 * Generates the background image based on the prompt derived from the copy step.
 */
export const generateAdImage = async (imagePrompt: string): Promise<string> => {
  // Using gemini-2.5-flash-image for standard high-quality generation.
  // We request a 1:1 aspect ratio which is versatile for cropping into various banners.
  const model = "gemini-2.5-flash-image";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: `Professional advertising background, ${imagePrompt}, high resolution, photorealistic, soft lighting, negative space for text` }
      ]
    },
    config: {
      // Nano Banana (flash-image) does NOT support responseMimeType or responseSchema.
      // We just parse the inlineData from the response.
    }
  });

  // Extract base64 image
  let base64Image = "";
  if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
              base64Image = part.inlineData.data;
              break;
          }
      }
  }

  if (!base64Image) {
      throw new Error("No image data returned from Gemini.");
  }

  return base64Image;
};