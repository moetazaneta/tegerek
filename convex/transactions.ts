import {v} from "convex/values"
import {api} from "./_generated/api"
import type {Doc} from "./_generated/dataModel"
import {transactionFields} from "./schema"
import {protectedMutation, protectedQuery} from "./utils/protected"

export type TransactionWithCurrency = Omit<Doc<"transactions">, "category"> & {
	currency: string
	category: string
}

export const getMine = protectedQuery({
	args: {
		categories: v.optional(v.array(v.id("categories"))),
	},
	handler: async (ctx, args) => {
		console.log(args)

		const transactionsPromise = ctx.db
			.query("transactions")
			.filter(q => q.eq(q.field("userId"), ctx.user._id))
			.filter(q =>
				args.categories
					? q.or(...args.categories.map(c => q.eq(q.field("category"), c)))
					: true,
			)
			.order("desc")
			.take(20)
		const accountsPromise = ctx.db
			.query("accounts")
			.withIndex("by_user", q => q.eq("userId", ctx.user._id))
			.collect()
		const categoriesPromise: Promise<Doc<"categories">[]> = ctx.runQuery(
			api.categories.getMine,
		)

		const [transactions, accounts, categories] = await Promise.all([
			transactionsPromise,
			accountsPromise,
			categoriesPromise,
		])

		return transactions.map(t => ({
			...t,
			// biome-ignore lint/style/noNonNullAssertion: it must be
			currency: accounts.find(a => a._id === t.accountId)!.currency,
			// biome-ignore lint/style/noNonNullAssertion: it must be
			category: categories.find(c => c._id === t.category)!.name,
		})) satisfies TransactionWithCurrency[]
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
