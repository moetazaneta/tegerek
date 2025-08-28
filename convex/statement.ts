import {v} from "convex/values"
import {getTransactions} from "../ai/transactions"
import {api} from "./_generated/api"
import {protectedAction} from "./utils/protected"

export const upload = protectedAction({
	args: {
		file: v.string(),
	},
	handler: async (ctx, args) => {
		console.log("upload", args.file)

		const categories = await ctx.runQuery(api.categories.getMyCategories)
		const tags = await ctx.runQuery(api.tags.getMyTags)

		console.log("categories", categories)
		console.log("tags", tags)

		const {accounts} = await getTransactions({
			statment: args.file,
			categories,
			tags,
		})

		// throw new Error("test")

		const accountPromises = (accounts ?? []).map(async a => {
			const accountId = await ctx.runMutation(api.accounts.create, {
				userId: ctx.user._id,
				id: a.id,
				name: a.name ?? a.id,
				currency: a.currency,
				bankName: a.bankName ?? undefined,
			})

			const transactionPromises = (a.transactions ?? []).map(async t => {
				await ctx.runMutation(api.transactions.create, {
					userId: ctx.user._id,
					accountId,
					date: t.date,
					amount: t.amount,
					transactionId: t.id,
					category: t.category,
					merchant: t.merchant,
					tags: t.tags ?? [],
					confidence: t.confidence,
					original: t.original,
				})
			})
			return Promise.all(transactionPromises)
		})

		const result = await Promise.all(accountPromises)

		return {
			accounts: result.length,
			transactions: result.flat().length,
		}
	},
})
