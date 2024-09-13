"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type Question } from "~/app/educakeType";

export async function getQuizData(quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }
    
    console.log('Starting fetch for quiz data');
    console.log('Quiz ID:', quizId);
    console.log('Authorization Token:', jwtToken);

    try {
        const response = await fetch("https://my.educake.co.uk/api/student/quiz/" + quizId, {
            method: "GET",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
            },
            referrer: "https://my.educake.co.uk/my-educake/quiz/" + quizId
        });

        console.log('Fetch response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        console.log('Fetched quiz data:', data);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        throw error; // Ensure errors are propagated to be handled by higher-level functions
    }
}

const geminiApiKey = process.env.GEMINI_API_KEY ?? "";
console.log('GEMINI_API_KEY:', geminiApiKey); // Avoid logging sensitive info in production

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getAnswer(questionData: Question) {
    console.log('Starting getAnswer');
    console.log('Question Data:', questionData);
    
    delete questionData.answer;

    try {
        const chat = model.startChat({ history: [{ role: "user", parts: [{ text: "YOU ARE AN AI DESIGNED TO TAKE IN QUESTION DATA AND RESPOND WITH THE ANSWER, ONLY ANSWER WITH THE ANSWER NO WHITESPACE, OTHER TEXT, OR FORMATTING!" }]}] });
        console.log('Chat started');
        
        const result = await chat.sendMessage(JSON.stringify(questionData));
        console.log('Chat result:', result);
        
        const answer = result.response.text().replace(" \n", "").replace("\n", "");
        console.log('Generated answer:', answer);

        return answer;
    } catch (error) {
        console.error('Error generating answer:', error);
        throw error;
    }
}

export async function postAnswer(questionId: number, answer: string, quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }

    console.log('Starting postAnswer');
    console.log('Question ID:', questionId);
    console.log('Answer:', answer);
    console.log('Quiz ID:', quizId);
    console.log('Authorization Token:', jwtToken);

    try {
        const response = await fetch(`https://my.educake.co.uk/api/attempt/${quizId}/question/${String(questionId)}/answer`, {
            method: "POST",
            headers: {
                Accept: "application/json;version=2",
                Authorization: jwtToken,
            },
            body: JSON.stringify({ givenAnswer: answer }),
            referrer: "https://my.educake.co.uk/my-educake/quiz/" + quizId
        });

        console.log('Post response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        console.log('Response after posting answer:', data);
        
        return 1;
    } catch (error) {
        console.error('Error posting answer:', error);
        throw error;
    }
}
