"use client"

import {useAction} from "convex/react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {api} from "@/convex/_generated/api"

export default function Home() {
	const [file, setFile] = useState<File | null>(null)

	const upload = useAction(api.statement.upload)

	const uploadFile = async () => {
		if (!file) return
		await upload({file: await file.text()})
	}

	return (
		<div className="flex flex-col gap-4">
			<Input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
			<Button onClick={uploadFile}>Upload</Button>
		</div>
	)
}
