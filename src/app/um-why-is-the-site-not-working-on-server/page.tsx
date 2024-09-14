"use client"

import { Button } from "~/components/ui/button"

import Nav from "next/link"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { TextHoverEffect } from "~/components/ui/text-hover-effect"
import { LuMoonStar, LuSun } from "react-icons/lu"
import { useState } from "react"

export default function Page() {

  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={`bg-background w-screen h-screen ${isDarkMode && "dark"} flex itemscenter justify-center transition-all`}>
      <div className="z-30 text-primary absolute top-0 md:left-0 m-4">
        <HoverCard>
          <HoverCardTrigger>
            <Nav href={"https://rccrevision.com"}>
              <Avatar>
                <AvatarImage src="https://github.com/davedude1011.png" className="rounded-full w-8 md:w-12"></AvatarImage>
                <AvatarFallback>D0</AvatarFallback>
              </Avatar>
            </Nav>
          </HoverCardTrigger>
          <HoverCardContent>
            <Nav href={"https://rccrevision.com"}>
              <Button className="border bg-background rounded-md mt-2" variant={"link"}>
                Explore more from me
              </Button>
            </Nav>
          </HoverCardContent>
        </HoverCard>
      </div>
      <TextHoverEffect text="Ugh..." />
      <div className="w-full h-full flex justify-center items-center">
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
            <div className="max-w-[30rem]">
                The fetch to educake (https://my.educake.co.uk/api/student/quiz/[quizID]) and basically any requests to educake are {"403'd"}, for some reason this isnt the case on localhost, so running this locally (<Nav href={"https://github.com/davedude1011/educake-auto"}><Button variant={"link"} className="text-blue-500 px-0">https://github.com/davedude1011/educake-auto</Button></Nav>) works fine. <br /> For some reason using Proxy {"IP's"} also doesnt work
            </div>
        </div>
      </div>
    </div>
  )
}