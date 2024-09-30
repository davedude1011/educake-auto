"use client"

import { useState } from "react"
//import { fetchData } from "~/server/fetchData"

export default function Page() {
    const [data, setData] = useState()
    return (
        <div>
            {
                JSON.stringify(data)
            }
            <button onClick={async() => {
                try {
                    const response = await fetch('/api/fetchData');
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const jsonData = await response.json();
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setData(jsonData);
                } catch (error) {
                    console.error('Error:', error);
                }
            }}>GET DATA</button>
        </div>
    )
}