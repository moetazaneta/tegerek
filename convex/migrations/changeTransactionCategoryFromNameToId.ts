import {internal} from "../_generated/api"
import {migrations} from "./migrations"

// export const runIt = migrations.runner(
// 	internal.migrations.transactionCategoryToCategoryId,
// )

export const changeTransactionCategoryFromNameToId = migrations.define({
	table: "transactions",
	batchSize: 100,
	migrateOne: async (ctx, transaction) => {
		const allCategories = await ctx.db.query("categories").collect()
		const category = allCategories.find(c => c.name === transaction.category)
		const other = allCategories.find(c => c.name === "other")
		return {category: category?._id ?? other?._id}
	},
})
