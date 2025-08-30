import {getAll} from "convex-helpers/server/relationships"
import {protectedQuery} from "./utils/protected"

export const getMine = protectedQuery({
	handler: async ctx => {
		const tags = await ctx.db
			.query("userTags")
			.filter(q => q.eq(q.field("userId"), ctx.user._id))
			.collect()
		const tagIds = tags.map(tag => tag.tagId)
		const myTags = (await getAll(ctx.db, tagIds)).filter(t => !!t)
		const defaultTags = await ctx.db
			.query("tags")
			.filter(q => q.eq(q.field("default"), true))
			.collect()
		return [...myTags, ...defaultTags]
	},
})
