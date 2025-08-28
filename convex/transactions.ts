import {transactionFields} from "./schema"
import {protectedMutation} from "./utils/protected"

export const create = protectedMutation({
	args: {
		...transactionFields,
	},
	handler: async (ctx, args) => {
		const transaction = await ctx.db.insert("transactions", args)
		return transaction
	},
})
