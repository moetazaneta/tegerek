import {convexAuthNextjsToken} from "@convex-dev/auth/nextjs/server"
import {fetchQuery} from "convex/nextjs"
import {redirect} from "next/navigation"
import {api} from "@/convex/_generated/api"

export default async function Root() {
	const hasOne = await fetchQuery(
		api.transactions.hasOne,
		{},
		{token: await convexAuthNextjsToken()},
	)

	if (!hasOne) {
		redirect("/intro")
	}

	redirect("/home")
}
