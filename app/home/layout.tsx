"use client"

import {useAuthActions} from "@convex-dev/auth/react"
import {useConvexAuth} from "convex/react"
import {type LucideIcon, UploadIcon} from "lucide-react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex flex-col items-center h-full w-full gap-8">
			<header className="flex flex-row items-center justify-end w-full">
				<HeaderItem Icon={UploadIcon}>Upload</HeaderItem>
				<SignOutButton />
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
			{/* <Icon size={20} strokeWidth={2.5} strokeLinecap="butt" /> */}
			{children}
		</Button>
	)
}

function SignOutButton() {
	const {isAuthenticated} = useConvexAuth()
	const {signOut} = useAuthActions()
	const router = useRouter()

	if (!isAuthenticated) return null

	return (
		<Button
			variant="og"
			onClick={() =>
				void signOut().then(() => {
					router.push("/signin")
				})
			}
		>
			Sign out
		</Button>
	)
}
