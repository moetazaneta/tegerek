import {useState} from "react"
import {randomTitle} from "@/lib/random-title"

export function Logo() {
	const [title, setTitle] = useState(randomTitle())
	return (
		<button
			type="button"
			onClick={() => setTitle(v => randomTitle(v))}
			className="text-xl font-bold"
		>
			{title}
		</button>
	)
}
