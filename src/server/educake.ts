"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { type Question } from "~/app/educakeType";

export async function getQuizData(quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }
    
    const response =  await fetch("https://my.educake.co.uk/api/student/quiz/" + quizId, {
        method: "GET",
        headers: {
            Accept: "application/json;version=2",
            Authorization: jwtToken,
        },
        referrer: "https://my.educake.co.uk/my-educake/quiz/" + quizId
    });
    const data = response.json()

    console.log(await data)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return await data
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY??"")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function getAnswer(questionData: Question) {
    delete questionData.answer
    
    const chat = model.startChat({ history: [{role: "user", parts: [{text: "YOU ARE AN AI DESIGNED TO TAKE IN QUESTION DATA AND RESPOND WITH THE ANSWER, ONLY ANSWER WITH THE ANSWER NO WHITESPACE, OTHER TEXT, OR FORMATTING!"}]}] })
    const result = await chat.sendMessage(JSON.stringify(questionData))
    const answer = result.response.text().replace(" \n", "").replace("\n", "")

    console.log(answer)

    return answer
}

export async function postAnswer(questionId: number, answer: string, quizId: string, jwtToken: string) {
    if (!jwtToken.startsWith("Bearer ")) {
        jwtToken = "Bearer " + jwtToken;
    }

    const response =  await fetch(`https://my.educake.co.uk/api/attempt/${quizId}/question/${String(questionId)}/answer`, {
        method: "POST",
        headers: {
            Accept: "application/json;version=2",
            Authorization: jwtToken,
        },
        body: `{\"givenAnswer\":\"${answer}\"}`,
        referrer: "https://my.educake.co.uk/my-educake/quiz/" + quizId
    });

    const data = response.json()

    console.log(await data)
    
    return 1
}