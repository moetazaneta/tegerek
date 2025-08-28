"use client"

import {UploadIcon} from "lucide-react"
import {motion} from "motion/react"
import {Button} from "@/components/ui/button"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col items-center h-full w-full gap-8">
			<header className="max-w-[300px] flex flex-row items-center justify-between w-full">
				<Button variant="ghost">
					<motion.div layoutId="upload-icon">
						<UploadIcon size={20} strokeWidth={2.5} strokeLinecap="butt" />
					</motion.div>
					Upload
				</Button>
			</header>
			{children}
		</div>
	)
}
