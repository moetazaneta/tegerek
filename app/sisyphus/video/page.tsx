"use client"

import {useEffect, useRef} from "react"
import {Card} from "@/components/ui/card"

export default function Home() {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (!videoRef.current) return
		const video = videoRef.current

		const maxAllowedTime = 5

		// video.addEventListener("timeupdate", () => {
		// 	if (video.currentTime > maxAllowedTime) {
		// 		maxAllowedTime = video.currentTime
		// 	}
		// })

		// Prevent seeking beyond maxAllowedTime
		video.addEventListener("seeking", () => {
			if (video.currentTime > maxAllowedTime) {
				video.currentTime = maxAllowedTime
			}
		})

		video.play()
	}, [])

	return (
		<Card className="w-[900px] p-4">
			<video
				src="
	https://www.w3schools.com/html/mov_bbb.mp4"
				controls
				// autoPlay
				// loop
				muted
				ref={videoRef}
			/>
		</Card>
	)
}
