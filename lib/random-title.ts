export function randomTitle(prevTitle?: string) {
	const titles = ["tegerek", "тегерек", "теgerек", "круглик", "cerclek"]
	const title = titles[Math.floor(Math.random() * titles.length)]
	if (prevTitle == null || prevTitle !== title) {
		return title
	}

	return randomTitle(prevTitle)
}
