"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type Question } from "~/app/educakeType";

// Helper function for logging errors
function logError(message: string, error: unknown) {
    console.error(`[ERROR] ${message}:`, error);
}

export async function getQuizData(quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }

    try {
        console.log(`Fetching quiz data for quizId: ${quizId}`);
        const response = await fetch(`https://my.educake.co.uk/api/student/quiz/${quizId}`, {
            method: "GET",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
            },
            referrer: `https://my.educake.co.uk/my-educake/quiz/${quizId}`
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        console.log(`Fetched data:`, data);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    } catch (error) {
        logError('Error fetching quiz data', error);
        throw error;  // Re-throw error after logging
    }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function getAnswer(questionData: Question) {
    delete questionData.answer

    try {
        console.log('Starting chat with AI model');
        const chat = model.startChat({ history: [{ role: "user", parts: [{ text: "YOU ARE AN AI DESIGNED TO TAKE IN QUESTION DATA AND RESPOND WITH THE ANSWER, ONLY ANSWER WITH THE ANSWER NO WHITESPACE, OTHER TEXT, OR FORMATTING!" }] }] });
        const result = await chat.sendMessage(JSON.stringify(questionData));
        const answer = result.response.text().replace(" \n", "").replace("\n", "");

        console.log(`AI response: ${answer}`);
        return answer;
    } catch (error) {
        logError('Error getting answer from AI', error);
        throw error;  // Re-throw error after logging
    }
}

export async function postAnswer(questionId: number, answer: string, quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }

    try {
        console.log(`Posting answer for questionId: ${questionId} and quizId: ${quizId}`);
        const response = await fetch(`https://my.educake.co.uk/api/attempt/${quizId}/question/${String(questionId)}/answer`, {
            method: "POST",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
            },
            body: JSON.stringify({ givenAnswer: answer }),  // Corrected body format
            referrer: `https://my.educake.co.uk/my-educake/quiz/${quizId}`
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        console.log(`Posted answer response:`, data);
        
        return 1;  // Adjust return value based on API response if needed
    } catch (error) {
        logError('Error posting answer', error);
        throw error;  // Re-throw error after logging
    }
}
