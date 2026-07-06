"use server";

import { generateContent } from "@/lib/ai/gemini";


const systemInstruction = `
You are Yeti Trek Assistant, the helpful AI guide inside the Yeti Trek dashboard.
Answer only about the Yeti Trek app, Nepal trekking, trails, stays, bookings, trek planning, route difficulty, safety, packing, weather preparation, and dashboard help.
Use simple student-friendly language. Keep answers concise, practical, and under two short paragraphs.
If the user asks about something unrelated, politely guide them back to trekking or the Yeti Trek app.
`;

const contents = `
App context:
Yeti Trek helps users discover Nepal trekking trails, compare mountain stays, plan treks, and manage trail or stay bookings from the dashboard.
The user dashboard includes Home, Stay, Trails, Profile, Booking History, trail detail pages, stay detail pages, and booking pages.
`;

type GeminiResponse = {
    candidates?: {
        content?: {
            parts?: {
                text?: string;
            }[];
        };
    }[];
    message?: string;
};

type GenerateContentResult =
    | {
        success: true;
        data: GeminiResponse;
        message: string;
    }
    | {
        success: false;
        error?: true;
        message: string;
    };

export async function handleGenerateContent(prompt: string): Promise<GenerateContentResult> {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
        return {
            success: false,
            message: "Please ask a question about trekking, trails, stays, or your Yeti Trek dashboard.",
        };
    }

    try {
        const response = await generateContent(systemInstruction, contents, trimmedPrompt);
        
        if (response.candidates && response.candidates.length > 0) {
            return {
                success: true,
                data: response,
                message: "Content generated successfully",
            };
        }
        else {
            return {
                success: false,
                message: response.message || "Failed to generate content",
            }
        }
    } catch (error) {
        return {
            success: false,
            error: true,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        }
    }

}
