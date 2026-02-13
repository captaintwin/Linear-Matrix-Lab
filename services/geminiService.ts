
import { GoogleGenAI, Type } from "@google/genai";
import { Matrix2x2, Vector2D } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMatrixInsights = async (matrix: Matrix2x2, vectors: Vector2D[]) => {
  const matrixStr = `[[${matrix[0][0]}, ${matrix[0][1]}], [${matrix[1][0]}, ${matrix[1][1]}]]`;
  const vectorsStr = vectors.map(v => `${v.label}(${v.x}, ${v.y})`).join(', ');

  const prompt = `Analyze the 2D linear transformation represented by the matrix ${matrixStr}. 
  The current vectors in the space are: ${vectorsStr}. 
  Explain what this transformation does geometrically (rotation, scaling, shear, etc.). 
  Calculate the determinant and explain its meaning regarding area.
  Mention how the basis vectors change.
  Format the response as a clear educational summary.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            mathDetails: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "explanation", "mathDetails"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
