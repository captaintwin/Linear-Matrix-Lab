
import { GoogleGenAI, Type } from "@google/genai";
import { Matrix2x2, Matrix3x3, Vector2D, Vector3D } from "../types";

// Fix: Using correct types and simplifying parameters
export const getMatrixInsights = async (matrix: Matrix2x2 | Matrix3x3, vectors: (Vector2D | Vector3D)[]) => {
  // Fix: Initializing GoogleGenAI using process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const matrixStr = JSON.stringify(matrix);
  const vectorsStr = vectors.map((v: any) => `${v.label}(${v.x}, ${v.y}${v.z !== undefined ? `, ${v.z}` : ''})`).join(', ');

  const prompt = `Analyze the linear transformation represented by the matrix ${matrixStr}. 
  The current vectors in the space are: ${vectorsStr}. 
  Explain what this transformation does geometrically (rotation, scaling, shear, projection, etc.). 
  Calculate the determinant and explain its meaning regarding volume/area change.
  If it's 3D, mention the orientation.
  Format the response as a clear educational summary for a student.`;

  try {
    // Fix: Using 'gemini-3-pro-preview' for complex text tasks (math reasoning)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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

    // Fix: Using the .text property directly (not a method) as per guidelines
    if (response.text) {
      return JSON.parse(response.text.trim());
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return null;
  }
};
