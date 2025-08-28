import {accountFields} from "./schema"
import {protectedMutation} from "./utils/protected"

export const create = protectedMutation({
	args: {
		...accountFields,
	},
	handler: async (ctx, args) => {
		const account = await ctx.db.insert("accounts", args)
		return account
	},
})
