import {useState} from "react"

function getRandomTitle(prevTitle?: string) {
	const titles = ["tegerek", "тегерек", "теgerек", "круглик", "cerclek"]
	const randomTitle = titles[Math.floor(Math.random() * titles.length)]
	if (prevTitle == null || prevTitle !== randomTitle) {
		return randomTitle
	}

	return getRandomTitle(prevTitle)
}

export function Logo() {
	const [title, setTitle] = useState(getRandomTitle())
	return (
		<button
			type="button"
			onClick={() => setTitle(v => getRandomTitle(v))}
			className="text-xl font-bold"
		>
			{title}
		</button>
	)
}
