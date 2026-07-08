import axios from "axios";

const API_KEY = process.env.GEMINI_API_KEY;

const aiApiClient = axios.create({
    baseURL: "https://generativelanguage.googleapis.com",
    headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    },
});

export const generateContent = async (systemInstruction: string, userContext: string, userQuery: string) => {
    if (!API_KEY) {
        throw new Error("Gemini API key is missing. Add GEMINI_API_KEY to your frontend environment file.");
    }

    try {
        const response = await aiApiClient.post("/v1beta/models/gemini-2.5-flash-lite:generateContent", {
            systemInstruction: {
                parts: [
                    {
                        text: systemInstruction
                    }
                ]
            },
            contents: [
                {
                    parts: [
                        { text: userContext },
                        { text: userQuery }
                    ]
                }
            ]
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const providerMessage = getProviderMessage(error.response?.data);

            console.error("Error generating content:", {
                status,
                message: providerMessage || error.message,
            });

            if (status === 503) {
                throw new Error(
                    "Gemini is temporarily unavailable. Please try again in a few minutes.",
                );
            }

            if (status === 400 || status === 401 || status === 403) {
                throw new Error(
                    "Gemini could not authorize this request. Please check the frontend GEMINI_API_KEY.",
                );
            }

            throw new Error(providerMessage || "Unable to generate content right now.");
        }

        console.error("Error generating content:", error);
        throw new Error("Unable to generate content right now.");
    }
};

const getProviderMessage = (data: unknown) => {
    if (
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "object" &&
        data.error !== null &&
        "message" in data.error &&
        typeof data.error.message === "string"
    ) {
        return data.error.message;
    }

    return "";
};
