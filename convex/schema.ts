import {authTables} from "@convex-dev/auth/server"
import {defineSchema, defineTable} from "convex/server"
import {v} from "convex/values"

export const accountFields = {
	userId: v.id("users"),
	id: v.string(),
	currency: v.string(),
	name: v.string(),
	bankName: v.optional(v.string()),
}

export const transactionFields = {
	userId: v.id("users"),
	accountId: v.id("accounts"),
	transactionId: v.string(), // reference from statement
	amount: v.number(), // credit=+ debit=-
	balance: v.optional(v.number()),
	date: v.string(), // ISO YYYY-MM-DD
	category: v.string(), // must match user’s categories
	merchant: v.string(), // normalized merchant/person
	tags: v.array(v.string()),
	confidence: v.number(), // 0–100
	original: v.string(), // raw description
}

export default defineSchema({
	...authTables,

	numbers: defineTable({
		value: v.number(),
	}),

	accounts: defineTable(accountFields).index("by_user", ["userId"]),

	transactions: defineTable(transactionFields)
		.index("by_user", ["userId"])
		.index("by_account", ["accountId"])
		.index("by_date", ["date"]),

	categories: defineTable({
		default: v.optional(v.boolean()),
		name: v.string(),
		prompt: v.string(), // description for AI classification
	}),

	userCategories: defineTable({
		userId: v.id("users"),
		categoryId: v.id("categories"),
		enabled: v.boolean(),
	}).index("by_user", ["userId"]),

	tags: defineTable({
		default: v.optional(v.boolean()),
		name: v.string(),
		prompt: v.string(), // description for AI classification
	}),

	userTags: defineTable({
		userId: v.id("users"),
		tagId: v.id("tags"),
		enabled: v.boolean(),
	}).index("by_user", ["userId"]),

	merchantNormalization: defineTable({
		userId: v.optional(v.id("users")), // null = global
		rawName: v.string(), // e.g. "SPAR1 SHOP"
		normalizedName: v.string(), // e.g. "SPAR"
	}).index("by_user", ["userId"]),
})
