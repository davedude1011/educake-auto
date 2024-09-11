"use client"

import { useState } from "react"
import { LuChevronsLeft, LuChevronsRight, LuHelpCircle, LuMoonStar, LuSun } from "react-icons/lu"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import Nav from "next/link"
import { useSearchParams } from "next/navigation"

export default function Page() {
    const searchParams = useSearchParams();
    const tutorialType = searchParams.get('type');

    const tutorialData = tutorialType == "jwt-token" ? [
        {
            text: "Open educake",
            image: "jwtToken/1.png"
        },
        {
            text: "Open Inspect Element - f12",
            image: "jwtToken/2.png"
        },
        {
            text: "Open the Application Tab from the top menu, if its not there click the + icon",
            image: "jwtToken/3.png"
        },
        {
            text: "Click 'Session Storage' then the option with 'www.educake in it'",
            image: "jwtToken/4.png"
        },
        {
            text: "Then copy the value with the title 'Token', thats your JWT token",
            image: "jwtToken/5.png"
        },
    ] : [
        {
            text: "Open educake",
            image: "quizId/1.png"
        },
        {
            text: "Open the quiz you want it to complete",
            image: "quizId/2.png"
        },
        {
            text: "Get the number from the end of the url, this is your quiz Id",
            image: "quizId/3.png"
        },
    ]
    const [tutorialIndex, setTutorialIndex] = useState(0)
    
    const [isDarkMode, setIsDarkMode] = useState(true)

    return (
        <div className={`${isDarkMode && "dark"} w-screen h-screen bg-background flex justify-center items-center`}>
            <div className="relative flex flex-col items-center text-primary min-w-fit h-full md:h-fit p-12 pt-16 w-full md:w-[30rem] gap-6 border rounded-md bg-background z-20">
                <Button variant={"ghost"} className="absolute top-0 left-0 m-2" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {
                    isDarkMode ? <LuSun /> : <LuMoonStar />
                    }
                </Button>
                <Nav href={"/"}>
                    <Button variant={"ghost"} className="absolute top-0 right-0 m-2">
                        Back
                    </Button>
                </Nav>

                <div className="text-2xl font-bold w-full">
                    {
                        tutorialType == "jwt-token"? "How to get your JWT Token" : "How to get your Quiz Id"
                    }
                </div>
                <Progress value={(tutorialIndex / (tutorialData.length-1))*100} />
                <img src={tutorialData[tutorialIndex]?.image} alt="" className="max-w-[50rem] rounded-md" />
                <div className="text-xl font-thin">{tutorialData[tutorialIndex]?.text}</div>
                <div className="flex flex-row justify-between w-full">
                    <Button disabled={tutorialIndex == 0} onClick={() => {setTutorialIndex(tutorialIndex-1)}}><LuChevronsLeft /></Button>
                    <Button disabled={tutorialIndex == tutorialData.length-1} onClick={() => {setTutorialIndex(tutorialIndex+1)}}><LuChevronsRight /></Button>
                </div>
            </div>
        </div>
    )
}