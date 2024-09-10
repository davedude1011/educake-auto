"use client"

import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { TextHoverEffect } from "~/components/ui/text-hover-effect"
import { HoverBorderGradient } from "~/components/ui/hover-border-gradient"
import { LuCode2, LuMoonStar, LuSparkles, LuSun } from "react-icons/lu";
import { useEffect, useState } from "react"
import { getAnswer, getQuizData, postAnswer } from "~/server/educake"
import type { QuizData, Question } from "./educakeType"
import { Skeleton } from "~/components/ui/skeleton"
import { Progress } from "~/components/ui/progress"

export default function Page() {
  const [quizId, setQuizId] = useState("")
  const [jwtToken, setJwtToken] = useState("")

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

  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={`bg-background w-screen h-screen ${isDarkMode && "dark"} flex itemscenter justify-center transition-all`}>
      <TextHoverEffect text="Educake" />
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative flex flex-col items-center text-primary min-w-fit h-full md:h-fit p-12 pt-16 w-full md:w-[30rem] gap-6 border rounded-md bg-background z-20">
          <Button variant={"ghost"} className="absolute top-0 left-0 m-2" onClick={() => setIsDarkMode(!isDarkMode)}>
            {
              isDarkMode ? <LuSun /> : <LuMoonStar />
            }
          </Button>
          {
            quizData ? (
              <div className="flex flex-col gap-6 w-full md:w-[30rem] h-full md:h-fit">
                <Progress value={completionPercent} />
                <div className="flex flex-col gap-2 w-full md:w-[30rem] h-full md:h-fit">
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