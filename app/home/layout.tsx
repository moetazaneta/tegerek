"use client"

import {useAction} from "convex/react"
import {type LucideIcon, UploadIcon} from "lucide-react"
import {useRouter} from "next/navigation"
import {useState, useTransition} from "react"
import {toast} from "sonner"
import {SignOutButton} from "@/app/components/sign-out-button"
import {AnimatedShinyText} from "@/components/magicui/animated-shiny-text"
import {Button} from "@/components/ui/button"
import {
	MorphingDialog,
	MorphingDialogClose,
	MorphingDialogContainer,
	MorphingDialogContent,
	MorphingDialogDescription,
	MorphingDialogTitle,
	MorphingDialogTrigger,
} from "@/components/ui/morphing-dialog"
import {Dropzone} from "@/components/ui/shadcn-io/dropzone"
import {api} from "@/convex/_generated/api"
import {cn} from "@/lib/utils"

function getRandomTitle() {
	const titles = ["tegerek", "тегерек", "теgerек", "круглик", "cerclek"]
	return titles[Math.floor(Math.random() * titles.length)]
}

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col items-center h-full w-full">
			<header className="p-8 flex flex-row items-center justify-between w-full">
				<div className="text-xl font-bold">{getRandomTitle()}</div>
				<div className="flex flex-row items-center">
					<ImportStatementButton />
					<SignOutButton />
				</div>
			</header>
			{children}
		</div>
	)
}

function HeaderItem({
	Icon,
	children,
}: {
	Icon: LucideIcon
	children: React.ReactNode
}) {
	return (
		<Button variant="og">
			<Icon size={20} strokeWidth={2.5} strokeLinecap="butt" />
			{children}
		</Button>
	)
}

function ImportStatementButton() {
	const upload = useAction(api.statement.upload)
	const [isPending, startTransition] = useTransition()
	const [status, setStatus] = useState<
		"idle" | "processing" | "success" | "error"
	>("idle")
	const router = useRouter()

	const uploadFile = async (file: File) => {
		return startTransition(async () => {
			try {
				await upload({file: await file.text()})
				toast.success("Statement successfully processed")
				setStatus("success")
				router.push("/home")
			} catch (error) {
				toast.error("Error processing statement", {
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

	const dropZone = (
		<Dropzone
			accept={{
				"text/xml": [".xml"],
			}}
			maxFiles={1}
			maxSize={1024 * 1024 * 10}
			onDrop={handleDrop}
			className={cn(
				"relative border-4 border-dashed  squircle-xl w-full",
				isPending && "bg-stone-100 animate-pulse",
			)}
		>
			<div className="flex flex-col gap-8 items-center">
				<div className="flex flex-row gap-4 items-center">
					<UploadIcon size={32} strokeWidth={2} strokeLinecap="butt" />

					<p className="text-lg">Drop file here or click to select</p>
				</div>
			</div>
		</Dropzone>
	)

	return (
		<MorphingDialog
			transition={{
				type: "spring",
				stiffness: 200,
				damping: 24,
			}}
		>
			<Button variant="og" asChild onClick={() => setStatus("idle")}>
				<MorphingDialogTrigger>
					<MorphingDialogTitle headless>
						{status === "idle" && "Import"}
						{status === "processing" && (
							<AnimatedShinyText>Importing</AnimatedShinyText>
						)}
						{status === "success" && (
							<div className="animate-pop animate-count-1 animate-duration-300 text-green-500">
								Imported
							</div>
						)}
						{status === "error" && (
							<div className="animate-pop animate-count-1 animate-duration-300 text-red-500">
								Import error
							</div>
						)}
					</MorphingDialogTitle>
				</MorphingDialogTrigger>
			</Button>
			<MorphingDialogContainer>
				<MorphingDialogContent className="shadow-2xl">
					<MorphingDialogTitle>
						{status === "idle" && "Import statement"}
						{status === "processing" && "Processing statement"}
						{status === "success" && "Statement processed"}
						{status === "error" && "Error processing statement"}
					</MorphingDialogTitle>
					<MorphingDialogDescription disableLayoutAnimation>
						{status === "idle" && (
							<>
								{dropZone}
								<div className="flex flex-col gap-2 mt-4">
									<p className="text-muted-foreground text-xs">
										* I use AI to extract the data, so it can fail sometimes.
									</p>
									<p className="text-muted-foreground text-xs">
										** We only support XML yet.
									</p>
								</div>
							</>
						)}
						{status === "processing" && (
							<>
								<p>Extracting data from the statement.</p>
								<p>It may take a while... You can close the dialog.</p>
								<p className="text-muted-foreground text-xs">
									* Damn it looks boring here.
								</p>
							</>
						)}
						{status === "success" && (
							<>
								<p>Statement processed</p>
								<p>You can close the dialog.</p>
							</>
						)}
						{status === "error" && (
							<>
								<p>Something went wrong. Try again.</p>
								{dropZone}
								<p className="text-muted-foreground text-xs">
									* Most likely the model failed to provide a valid json. I will
									handle it more gracefully in the future.
								</p>
							</>
						)}
					</MorphingDialogDescription>
					<MorphingDialogClose />
				</MorphingDialogContent>
			</MorphingDialogContainer>
		</MorphingDialog>
	)
}
