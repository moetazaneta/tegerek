"use client"

import {useState} from "react"
import {Input} from "@/components/ui/input"

export default function Home() {
	const [file, setFile] = useState<File | null>(null)

	if (!file) {
		return (
			<Input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
		)
	}

	return <Content file={file} />
}

function Content({file}: {file: File}) {
	return (
		<div>
			<h1>File</h1>
			<p>{file.name}</p>
		</div>
	)
}
