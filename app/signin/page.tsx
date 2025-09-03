"use client"

import {useAuthActions} from "@convex-dev/auth/react"
import {SpinningText} from "@/components/magicui/spinning-text"
import {Button} from "@/components/ui/button"

export default function SignIn() {
	const {signIn} = useAuthActions()
	return (
		<div className="flex flex-col gap-8 items-center justify-center h-full">
			<SpinningText className="size-32 absolute top-[20%] text-xl" radius={7}>
				tegerek • тегерек • круглый •
			</SpinningText>

			<Button size="huge" type="button" onClick={() => void signIn("google")}>
				Sign in with Google
			</Button>
		</div>
	)
}
