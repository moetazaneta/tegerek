"use client"

import {useAction} from "convex/react"
import {UploadIcon} from "lucide-react"
import {AnimatePresence, motion} from "motion/react"
import {useRouter} from "next/navigation"
import {useState, useTransition} from "react"
import {toast} from "sonner"
import {Dropzone} from "@/components/ui/shadcn-io/dropzone"
import {api} from "@/convex/_generated/api"
import {cn} from "@/lib/utils"

export default function Home() {
	const upload = useAction(api.statement.upload)
	const [isPending, startTransition] = useTransition()
	const [status, setStatus] = useState<
		"idle" | "processing" | "success" | "error"
	>("idle")
	const router = useRouter()

	const uploadFile = async (file: File) => {
		toast("Processing statement", {
			description: "This may take a while",
			duration: 10000,
		})

		return startTransition(async () => {
			try {
				await upload({file: await file.text()})
				toast.success("Statement successfully processed")
				setStatus("success")
				router.push("/home")
			} catch (error) {
				toast.error("Error processing statement", {
					description: "Success rate of the model is 95%",
					action: {
						label: "Try again",
						onClick: () => uploadFile(file),
					},
				})
				console.error(error)
			}
		})
	}

	const handleDrop = async (files: File[]) => {
		setStatus("processing")
		await uploadFile(files[0])
	}

	return (
		<AnimatePresence>
			<div className="flex flex-col gap-6 items-center justify-center h-full">
				{status === "success" && (
					<div className="border-4 border-emerald-100 bg-emerald-50 pl-20 pr-24 py-12 squircle-[64px]! flex flex-col gap-8 items-center min-w-[450px] text-green-950">
						<div className="flex flex-row gap-8 items-center">
							<motion.div layoutId="upload-icon">
								<UploadIcon size={80} strokeWidth={2} strokeLinecap="butt" />
							</motion.div>

							<div className="flex flex-col gap-4">
								<h2 className="font-bold text-2xl">Statement processed</h2>
								<p className="text-muted-foreground">
									You can proceed to the next step.
								</p>
							</div>
						</div>
					</div>
				)}

				{status === "processing" && (
					<div className="border-4 border-stone-100 pl-20 pr-24 py-12 squircle-[64px]! flex flex-col gap-8 items-center min-w-[450px]">
						<div className="flex flex-row gap-8 items-center">
							<motion.div layoutId="upload-icon" className="animate-bounce">
								<UploadIcon size={80} strokeWidth={2} strokeLinecap="butt" />
							</motion.div>

							<div className="flex flex-col gap-4">
								<h2 className="font-bold text-2xl">Statement is processing</h2>
								<p className="text-muted-foreground">It may take a while.</p>
							</div>
						</div>
					</div>
				)}

				{status === "idle" && (
					<>
						<motion.div key="dropzone" exit={{opacity: 0}}>
							<Dropzone
								accept={{
									"text/xml": [".xml"],
								}}
								maxFiles={1}
								maxSize={1024 * 1024 * 10}
								onDrop={handleDrop}
								className={cn(
									"relative border-4 border-stone-100 pl-20 pr-24 py-12 squircle-[64px]!",
									isPending && "bg-stone-100 animate-pulse",
								)}
							>
								<div className="flex flex-col gap-8 items-center min-w-[450px]">
									<div className="flex flex-row gap-8 items-center">
										<motion.div layoutId="upload-icon">
											<UploadIcon
												size={72}
												strokeWidth={2}
												strokeLinecap="butt"
												// className="text-stone-300"
											/>
										</motion.div>

										<div className="flex flex-col gap-4">
											<h2 className="font-bold text-2xl">
												Upload first statement
											</h2>
											<p className="text-muted-foreground">
												Drop file here or click to select.
											</p>
										</div>
									</div>
								</div>
							</Dropzone>
						</motion.div>
						<motion.div
							key="footer"
							exit={{opacity: 0}}
							className="flex flex-col gap-2 -mb-16"
						>
							<p className="text-muted-foreground text-xs">
								* I use AI to extract the data, so it can fail sometimes.
							</p>
							<p className="text-muted-foreground text-xs">
								** We only support XML yet.
							</p>
						</motion.div>
					</>
				)}
			</div>
		</AnimatePresence>
	)
}
