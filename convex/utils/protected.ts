import {
	customAction,
	customMutation,
	customQuery,
} from "convex-helpers/server/customFunctions"
import {api} from "../_generated/api"
import type {Doc, Id} from "../_generated/dataModel"
import {action, mutation, type QueryCtx, query} from "../_generated/server"

export const protectedQuery = customQuery(query, {
	args: {},
	input: async ctx => {
		const user = await getCurrentUser(ctx)
		return {
			ctx: {user},
			args: {},
		}
	},
})

export const protectedMutation = customMutation(mutation, {
	args: {},
	input: async ctx => {
		const user = await getCurrentUser(ctx)
		return {
			ctx: {user},
			args: {},
		}
	},
})

export const protectedAction = customAction(action, {
	args: {},
	input: async (ctx): Promise<{args: {}; ctx: {user: Doc<"users">}}> => {
		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) {
			throw new Error("User not found")
		}

		const user = await ctx.runQuery(api.users.getById, {
			id: identity.subject.split("|")[0] as Id<"users">,
		})

		if (!user) {
			throw new Error("User not found")
		}

		return {
			ctx: {user},
			args: {},
		}
	},
})

export async function getCurrentUser(ctx: QueryCtx) {
	const identity = await ctx.auth.getUserIdentity()
	if (identity === null) {
		throw new Error("User not found")
	}
	const user = await ctx.db.get(identity.subject.split("|")[0] as Id<"users">)
	if (!user) {
		throw new Error("User not found")
	}
	return user
}
