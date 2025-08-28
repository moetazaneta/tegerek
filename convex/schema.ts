import {authTables} from "@convex-dev/auth/server"
import {defineSchema, defineTable} from "convex/server"
import {v} from "convex/values"

export default defineSchema({
	...authTables,

	numbers: defineTable({
		value: v.number(),
	}),

	accounts: defineTable({
		userId: v.id("users"),
		id: v.string(),
		name: v.string(),
		currency: v.string(),
		bankName: v.string(),
	}).index("by_user", ["userId"]),

	transactions: defineTable({
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
	})
		.index("by_user", ["userId"])
		.index("by_account", ["accountId"])
		.index("by_date", ["date"]),

	categories: defineTable({
		userId: v.optional(v.id("users")), // null = default
		name: v.string(),
		prompt: v.string(), // description for AI classification
	}).index("by_user", ["userId"]),

	userCategories: defineTable({
		userId: v.id("users"),
		categoryId: v.id("categories"),
		enabled: v.boolean(),
	}).index("by_user", ["userId"]),

	tags: defineTable({
		userId: v.optional(v.id("users")), // null = default
		name: v.string(),
		prompt: v.string(), // description for AI classification
		enabled: v.boolean(),
	}).index("by_user", ["userId"]),

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
