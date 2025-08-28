import {v} from "convex/values"
import {query} from "./_generated/server"

export const getById = query({
	args: {
		id: v.id("users"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id)
	},
})
