
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ImageData } from '../types';

const fileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve({
          data: reader.result.split(',')[1],
          mimeType: file.type,
        });
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export const generateFourImages = async (
    prompt: string,
    characterFiles: File[],
    backgroundFile: File | null,
    useBackground: boolean
): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const characterImages = await Promise.all(characterFiles.map(fileToImageData));
    const background = backgroundFile ? await fileToImageData(backgroundFile) : null;

    const parts: Part[] = [];
    
    characterImages.forEach(img => {
        parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    });

    let finalPrompt = `Using the provided character images as a strict reference for style and appearance, create a high-resolution 2K image of them doing the following: "${prompt}".`;

    if (useBackground && background) {
        parts.push({ inlineData: { data: background.data, mimeType: background.mimeType } });
        finalPrompt = `Using the provided background image as the exact background, and using the provided character images as a strict reference for style and appearance, create a high-resolution 2K image of the characters doing the following: "${prompt}". Do not change the background.`;
    }

    parts.push({ text: finalPrompt });

    const generationPromises = Array(4).fill(0).map(() => 
        ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        })
    );
    
    try {
        const responses = await Promise.all(generationPromises);
        const allImages: string[] = [];
        responses.forEach(response => {
            if (response.candidates && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        allImages.push(part.inlineData.data);
                    }
                }
            } else {
                 console.warn("A generation call completed but returned no image parts.", response);
            }
        });
        
        if (allImages.length === 0 && responses.length > 0) {
            throw new Error("Image generation failed. The model did not return any images. Please check your prompt and reference images.");
        }

        return allImages.slice(0, 4);
    } catch (error) {
        console.error("Error generating images with Gemini:", error);
        throw new Error("Failed to generate images. Please check the console for more details.");
    }
};
