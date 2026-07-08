"use server";

import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/api/axios-instance";
import type { Trail } from "@/lib/api/trails";

export type AiRecommendation = {
    type: "trail" | "stay";
    slug: string;
    title: string;
    reason: string;
    price?: string;
    difficulty?: Trail["difficulty"];
    detailHref: string;
    bookingHref?: string;
};

type AiBackendResponse = {
    answer: string;
    recommendations: AiRecommendation[];
};

type GenerateContentResult =
    | {
        success: true;
        data: AiBackendResponse;
        answer: string;
        recommendations: AiRecommendation[];
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
        const response = await axiosInstance.post("/ai/trek-assistant", {
            question: trimmedPrompt,
        });
        const data = response.data.data as AiBackendResponse;

        return {
            success: true,
            data,
            answer: data.answer,
            recommendations: data.recommendations,
            message: response.data.message || "Content generated successfully",
        };
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;

        return {
            success: false,
            error: true,
            message:
                axiosError.response?.data?.message ||
                (error instanceof Error ? error.message : "Unable to generate AI response"),
        };
    }
}
