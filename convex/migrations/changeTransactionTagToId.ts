import {migrations} from "./migrations"

export const changeTransactionTagToId = migrations.define({
	table: "transactions",
	batchSize: 100,
	migrateOne: async (ctx, transaction) => {
		const allTags = await ctx.db.query("tags").collect()
		const tags = allTags.filter(t => transaction.tags?.includes(t._id))
		return {tags: tags.map(t => t._id)}
	},
})
