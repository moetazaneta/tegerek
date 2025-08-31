import type {Metadata} from "next"

export const metadata: Metadata = {
	title: "Sisyphus",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col items-center h-screen w-screen p-8">
			{children}
		</div>
	)
}
