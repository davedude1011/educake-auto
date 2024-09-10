"use client"

import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { TextHoverEffect } from "~/components/ui/text-hover-effect"
import { HoverBorderGradient } from "~/components/ui/hover-border-gradient"
import { LuCode2, LuSparkles } from "react-icons/lu";
import { useEffect, useState } from "react"
import { getAnswer, getQuizData, postAnswer } from "~/server/educake"
import type { QuizData, Question } from "./educakeType"
import { Skeleton } from "~/components/ui/skeleton"
import { Progress } from "~/components/ui/progress"

export default function Page() {
  const [quizId, setQuizId] = useState("134790229")
  const [jwtToken, setJwtToken] = useState("Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjU5OTM5ODYsIm5iZiI6MTcyNTk5Mzk4NiwiZXhwIjoxNzI1OTk1Nzg3LCJpc3MiOiJFZHVjYWtlIiwiYXVkIjoic2Vzc2lvbiIsInVpZCI6IjMwMDI3NTgiLCJyb2xlIjoic3R1ZGVudCIsInRpdGxlIjoiIiwiZmlyc3RfbmFtZSI6IlRob21hcyIsImxhc3RfbmFtZSI6IlNNQUxMV09PRCIsInNjaG9vbF9uYW1lIjoiUm9iZXJ0c2JyaWRnZSBDb21tdW5pdHkgQ29sbGVnZSIsInNjaG9vbF9hZGRyZXNzIjoiS25lbGxlIFJvYWQsIFJPQkVSVFNCUklER0UsIEVhc3QgU3Vzc2V4LCBVSywgVE4zMiA1RUEifQ.2bJyI4ulAu-1xYvLg_1esqMIzrsMCTaB053hZuTSpRw")

  const [quizData, setQuizData] = useState(null as QuizData|null)
  //const quizQuestionDataArray = quizData?.questions.map((questionId) => quizData?.questionMap[questionId])

  const [displayQuestion, setDisplayQuestion] = useState("")
  const [displayAnswer, setDisplayAnswer] = useState("")
  const [completionPercent, setCompletionPercent] = useState(0)

  function questionDataLoop(imediateQuizData: QuizData) {
    const imediateQuizQuestionDataArray = imediateQuizData?.questions.map((questionId) => imediateQuizData?.questionMap[questionId])

    function loopTask(index: number) {
      setDisplayAnswer("")

      if (imediateQuizQuestionDataArray) {
        setDisplayQuestion(imediateQuizQuestionDataArray[index]?.question ?? "")

        if (imediateQuizQuestionDataArray[index]) {
          getAnswer(imediateQuizQuestionDataArray[index])
            .then((geminiAnswer) => {
              postAnswer(Number(imediateQuizQuestionDataArray[index]?.id), geminiAnswer, quizId, jwtToken)
                .catch((error) => console.log(error))

              setDisplayAnswer(geminiAnswer)
              setCompletionPercent(Math.round((index/imediateQuizQuestionDataArray.length)*100))
            })
            .catch((error) => console.log(error))
        }
      }
    }

    if (imediateQuizQuestionDataArray) {
      loopTask(0)
      let loopCounter = 1

      const questionLoopInterval = setInterval(() => {

        loopTask(loopCounter)

        if (loopCounter >= imediateQuizQuestionDataArray.length) {
          clearInterval(questionLoopInterval)
          setDisplayQuestion("")
          setDisplayAnswer("")
          setQuizData(null)
          setQuizId("")
        }

        loopCounter++
      }, 5000)
    }
  }

  return (
    <div className="bg-background w-screen h-screen dark flex itemscenter justify-center">
      <TextHoverEffect text="Educake" />
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center text-primary min-w-fit p-12 w-[30rem] gap-6 border rounded-md bg-background z-20 h-fit">
          {
            quizData ? (
              <div className="flex flex-col gap-6 w-[30rem]">
                <Progress value={completionPercent} />
                <div className="flex flex-col gap-2 w-[30rem]">
                  <div className="font-bold">{displayQuestion}</div>
                  <div className="font-thin flex flex-row gap-2 items-center">
                    <LuSparkles />
                    {
                      displayAnswer ? displayAnswer : <Skeleton><div className="invisible">random text</div></Skeleton>
                    }
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="quizId">Quiz ID</Label>
                  <Input type="quizId" id="quizId" placeholder="Enter Quiz ID" value={quizId} onChange={(e) => {setQuizId(e.target.value)}} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="jwtToken">JWT Token</Label>
                  <Input type="jwtToken" id="jwtToken" placeholder="Enter Your JWT Token" value={jwtToken} onChange={(e) => {setJwtToken(e.target.value)}} />
                </div>
                <HoverBorderGradient className="flex flex-row items-center gap-2" onClick={() => {
                  getQuizData(quizId, jwtToken)
                    .then((response) => {
                      console.log(response)
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                      setQuizData(response.attempt?.[String(quizId)])
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                      questionDataLoop(response.attempt?.[String(quizId)])
                    })
                    .catch((error) => console.log(error))
                }}>
                  <LuCode2 />
                  <span>Complete Quiz</span>
                </HoverBorderGradient>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}