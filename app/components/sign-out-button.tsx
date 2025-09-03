"use client"
import {useAuthActions} from "@convex-dev/auth/react"
import {useConvexAuth} from "convex/react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"

export function SignOutButton() {
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
