import {SignOutButton} from "@/app/components/sign-out-button"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col items-center justify-center h-full w-full gap-8">
			<header className="p-8 flex flex-row items-center justify-end w-full min-h-[101px]">
				<SignOutButton />
			</header>
			{children}
		</div>
	)
}
