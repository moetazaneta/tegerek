import {getAll} from "convex-helpers/server/relationships"
import {protectedQuery} from "./utils/protected"

export const getMine = protectedQuery({
	handler: async ctx => {
		const categories = await ctx.db
			.query("userCategories")
			.filter(q => q.eq(q.field("userId"), ctx.user._id))
			.collect()
		const categoryIds = categories.map(category => category.categoryId)
		const myCategories = (await getAll(ctx.db, categoryIds)).filter(c => !!c)
		const defaultCategories = await ctx.db
			.query("categories")
			.filter(q => q.eq(q.field("default"), true))
			.collect()
		return [...myCategories, ...defaultCategories]
	},
})
