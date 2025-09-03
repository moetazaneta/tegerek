import {type FilterBuilder, type NamedTableInfo, Query} from "convex/server"
import {v} from "convex/values"
import {filter} from "convex-helpers/server/filter"
import {api} from "./_generated/api"
import type {DataModel, Doc} from "./_generated/dataModel"
import {transactionFields} from "./schema"
import {protectedMutation, protectedQuery} from "./utils/protected"

export type TransactionWithCurrency = Omit<
	Doc<"transactions">,
	"category" | "tags"
> & {
	currency: string
	category: string
	tags: string[]
}

export const hasOne = protectedQuery({
	handler: async ctx => {
		const transactions = await ctx.db
			.query("transactions")
			.filter(q => q.eq(q.field("userId"), ctx.user._id))
			.take(1)
		return transactions.length === 1
	},
})

export const getMine = protectedQuery({
	args: {
		categories: v.optional(v.array(v.id("categories"))),
		tags: v.optional(v.array(v.id("tags"))),
		income: v.optional(v.boolean()),
		expenses: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		console.log("getMine", args)
		function incomeExpensesFilter(
			q: FilterBuilder<NamedTableInfo<DataModel, "transactions">>,
		) {
			const income = args.income ?? true
			const expenses = args.expenses ?? true
			if ((income && expenses) || (!income && !expenses)) {
				return true
			}
			if (income) {
				return q.gt(q.field("amount"), 0)
			}
			return q.lt(q.field("amount"), 0)
		}
		const transactionsPromise = filter(
			ctx.db
				.query("transactions")
				.filter(q => q.eq(q.field("userId"), ctx.user._id))
				.filter(q =>
					args.categories && args.categories.length > 0
						? q.or(...args.categories.map(c => q.eq(q.field("category"), c)))
						: true,
				)
				.filter(incomeExpensesFilter)
				.order("desc"),
			tran =>
				args?.tags?.length === 0 ||
				(args.tags?.some(tag => tran.tags?.includes(tag)) ?? true),
		).collect()

		const accountsPromise = ctx.db
			.query("accounts")
			.withIndex("by_user", q => q.eq("userId", ctx.user._id))
			.collect()
		const categoriesPromise: Promise<Doc<"categories">[]> = ctx.runQuery(
			api.categories.getMine,
		)
		const tagsPromise: Promise<Doc<"tags">[]> = ctx.runQuery(api.tags.getMine)

		const [transactions, accounts, categories, tags] = await Promise.all([
			transactionsPromise,
			accountsPromise,
			categoriesPromise,
			tagsPromise,
		])

		return transactions.map(t => ({
			...t,
			// biome-ignore lint/style/noNonNullAssertion: it must be
			currency: accounts.find(a => a._id === t.accountId)!.currency,
			// biome-ignore lint/style/noNonNullAssertion: it must be
			category: categories.find(c => c._id === t.category)!.name,
			tags: tags.filter(tag => t.tags.includes(tag._id)).map(t => t.name),
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
