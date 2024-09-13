"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type Question } from "~/app/educakeType";

// Utility function to check if response is JSON
async function parseJSON(response: Response) {
    try {
        const text = await response.text();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(text);
    } catch {
        throw new Error("Invalid JSON response");
    }
}

export async function getQuizData(quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }
    
    try {
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
        const data = await parseJSON(response);
        console.log(data);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        throw error;
    }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getAnswer(questionData: Question) {
    delete questionData.answer;
    
    try {
        const chat = model.startChat({ history: [{ role: "user", parts: [{ text: "YOU ARE AN AI DESIGNED TO TAKE IN QUESTION DATA AND RESPOND WITH THE ANSWER, ONLY ANSWER WITH THE ANSWER NO WHITESPACE, OTHER TEXT, OR FORMATTING!" }] }] });
        const result = await chat.sendMessage(JSON.stringify(questionData));
        const answer = result.response.text().replace(/ \n|\n/g, "").trim();

        console.log(answer);
        return answer;
    } catch (error) {
        console.error("Error getting answer:", error);
        throw error;
    }
}

export async function postAnswer(questionId: number, answer: string, quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }

    try {
        const response = await fetch(`https://my.educake.co.uk/api/attempt/${quizId}/question/${questionId}/answer`, {
            method: "POST",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ givenAnswer: answer }),
            referrer: `https://my.educake.co.uk/my-educake/quiz/${quizId}`
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await parseJSON(response);
        console.log(data);
        return 1; // Assuming this is a success code
    } catch (error) {
        console.error("Error posting answer:", error);
        throw error;
    }
}
