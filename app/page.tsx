"use client"

import {useAction} from "convex/react"
import {useState, useTransition} from "react"
import {toast} from "sonner"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {api} from "@/convex/_generated/api"

export default function Home() {
	const [file, setFile] = useState<File | null>(null)

	const upload = useAction(api.statement.upload)

	const [isPending, startTransition] = useTransition()

	const uploadFile = async () => {
		if (!file) return
		toast("Processing statement", {
			description: "This may take a while",
			duration: 10000,
		})

		startTransition(async () => {
			try {
				await upload({file: await file.text()})
				toast.success("Statement successfully processed")
			} catch (error) {
				toast.error("Error processing statement", {
					description: "Success rate of the model is 95%",
					action: {
						label: "Try again",
						onClick: () => uploadFile(),
					},
				})
				console.error(error)
			}
		})
	}

	return (
		<div className="flex flex-col gap-4">
			<Input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
			<Button disabled={isPending} onClick={uploadFile}>
				{isPending ? "Uploading..." : "Upload"}
			</Button>
		</div>
	)
}
