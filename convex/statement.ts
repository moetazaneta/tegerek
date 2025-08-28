import {v} from "convex/values"
import {getTransactions} from "../ai/transactions"
import {protectedAction} from "./utils/protected"

export const upload = protectedAction({
	args: {
		file: v.string(),
	},
	handler: async (ctx, args) => {
		console.log("upload", args.file)

		const categoriesMock = [
			{
				name: "groceries",
				prompt: "Supermarkets, grocery stores, food shops",
			},
			{
				name: "restaurants",
				prompt: "Cafes, restaurants, bars, fast food",
			},
			{
				name: "entertainment",
				prompt: "Streaming services, music, cinema, subscriptions",
			},
			{
				name: "transport",
				prompt: "Taxi, metro, bus, fuel",
			},
			{
				name: "shopping",
				prompt: "Retail, clothing, electronics, Amazon, Wildberries, Ozon",
			},

			{
				name: "transfer",
				prompt: "Bank transfers, P2P payments",
			},

			{
				name: "income",
				prompt: "Salary, deposits, account top-ups",
			},

			{
				name: "other",
				prompt: "Anything that does not fit other categories",
			},
		]

		const tagsMock = [
			{
				name: "subscription",
				prompt: "Recurring payments for digital services",
			},
			{
				name: "music",
				prompt: "Music-related services like Spotify, Apple Music",
			},
		]

		const transactions = await getTransactions({
			statment: args.file,
			categories: categoriesMock,
			tags: tagsMock,
		})

		return transactions
	},
})
