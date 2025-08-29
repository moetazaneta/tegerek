import {transactionFields} from "./schema"
import {protectedMutation, protectedQuery} from "./utils/protected"

export const getMine = protectedQuery({
	handler: async ctx => {
		const transactionsPromise = ctx.db
			.query("transactions")
			.withIndex("by_dateUser", q => q.eq("userId", ctx.user._id))
			.order("desc")
			.collect()
		const accountsPromise = ctx.db
			.query("accounts")
			.withIndex("by_user", q => q.eq("userId", ctx.user._id))
			.collect()
		const [transactions, accounts] = await Promise.all([
			transactionsPromise,
			accountsPromise,
		])

		return transactions.map(t => ({
			...t,
			// biome-ignore lint/style/noNonNullAssertion: it must be
			currency: accounts.find(a => a._id === t.accountId)!.currency,
		}))
	},
})

export const create = protectedMutation({
	args: {
		...transactionFields,
	},
	handler: async (ctx, args) => {
		const transaction = await ctx.db.insert("transactions", args)
		return transaction
	},
})
