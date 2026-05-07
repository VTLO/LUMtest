/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

let ai: any = null;

function getAI() {
  if (!ai && API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

export async function suggestQuestions(topic: string, count: number = 3) {
  const model = "gemini-3-flash-preview";
  const genAI = getAI();
  if (!genAI) return [];

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: `Suggère ${count} questions de sondage pertinentes pour le sujet suivant: "${topic}". 
      Réponds uniquement sous forme de liste JSON d'objets avec "title" (string) et "type" (soit "short_text", "multiple_choice", ou "checkbox").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["short_text", "multiple_choice", "checkbox"] }
            },
            required: ["title", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error suggesting questions:", error);
    return [];
  }
}

export async function getAIAssistantResponse(query: string) {
  const model = "gemini-3-flash-preview";
  const genAI = getAI();
  if (!genAI) return "Désolé, je ne peux pas vous aider pour le moment car la clé API est manquante.";

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: `Tu es un assistant expert pour un logiciel de marketing "Digital Store". Aide l'utilisateur avec sa question: "${query}". Réponds en français de manière concise.`,
    });

    return response.text || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Error assistant response:", error);
    return "Une erreur est survenue lors de la communication avec l'IA.";
  }
}
