import {streamText} from "ai"
import {z} from "zod/v4"
import {openrouter} from "./open-router"

type Category = {
	name: string
	prompt: string
}

const transactionSchema = z.object({
	id: z.string(),
	amount: z.number(),
	balance: z.number().nullish().default(null),
	date: z.string(),
	time: z.string().nullish().default(null),
	category: z.string(),
	merchant: z.string(),
	tags: z.array(z.string()).nullish().default([]),
	confidence: z.number().min(0).max(100),
	original: z.string(),
})

const transactionsSchema = z.object({
	accounts: z
		.array(
			z.object({
				bankName: z.string().nullish().default(null),
				id: z.string(),
				name: z.string().nullish().default(null),
				currency: z.string(),
				transactions: z.array(transactionSchema).nullish().default([]),
			}),
		)
		.nullish()
		.default([]),
})

export type Transactions = z.infer<typeof transactionsSchema>

export class AiError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "AiError"
	}
}

export class JsonParseError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "JsonParseError"
	}
}

export async function getTransactions({
	statment,
	categories,
	tags,
}: {
	statment: string
	categories: Category[]
	tags: Category[]
}) {
	const categoriesList = categories
		.map(category => `- ${category.name}: ${category.prompt}`)
		.join("\n")

	const tagsList = tags.map(tag => `- ${tag.name}: ${tag.prompt}`).join("\n")

	const systemPrompt = `
You are a financial data parser.
You receive bank statements in XML format.
Your task is to extract accounts and their transactions, and normalize them into structured JSON.

The user has defined the following categories:
${categoriesList}

The user has defined the following tags:
${tagsList}

Rules:
- Always output valid JSON only, no explanations.
- The JSON must have the following structure:
  {
    "accounts": [
      {
        "bankName": string,
        "id": string,
        "name": string,
        "currency": string,
        "transactions": [
          {
            "id": string,
            "amount": number, positive for credit, negative for debit
            "balance": number or null, balance after transaction if available
            "date": string, ISO format YYYY-MM-DD
						"time": string, ISO format HH:MM:SS
            "category": string, must be one of the categories defined above
            "merchant": string, normalized merchant/person name
            "tags": array of strings, must be chosen from the tags defined above
            "confidence": integer 0–100, minimum confidence across all fields
            "original": string, original description text
          }
        ]
      }
    ]
  }

Parsing rules:
- Extract account info from <AccountInfo> (id, name, currency).
- Bank name: if not explicitly present, infer from context (e.g. "MBANK" from description).
- Transaction id = <Reference>.
- Date = <ValueDate> in format DD.MM.YYYY → YYYY-MM-DD.
- Time = Inlined in <Description> in format HH:MM:SS → HH:MM:SS.
- Amount = Credit - Debit (credit positive, debit negative).
- Balance = <Balance> if available, otherwise null.
- Category: classify into one of the categories defined above. If unsure, use "other".
- Merchant: normalize merchant names (e.g. "SPAR1 SHOP", "MINISPAR" → "SPAR"). Prefer short names. If it's a person name, only use first and last name.
- Tags: assign based on the tag definitions above. If none apply, leave empty.
- Confidence: Confidence in data quality you provide, assign per field, then take the minimum as the transaction confidence.
- Original: copy the full <Description> text.

Output ONLY valid JSON. Do not add trailing commas. Do not add comments. Do not add explanations. Do not format the JSON.

Do not invent data that is not in the statement.

Example:

\`\`\`json
{
  "accounts": [
    {
      "bankName": "MBANK",
      "id": "1280096054862572",
      "name": "USD card acc/Sotnichenko Artem Maksimovich(VC)",
      "currency": "USD",
      "transactions": [
        {
          "id": "009pz10251501002",
          "amount": -4.99,
          "balance": 576.94,
          "date": "2025-05-30",
          "category": "entertainment",
          "merchant": "Spotify",
          "tags": ["subscription", "music"],
          "confidence": 90,
          "original": "POS payment at SPOTIFY (35467214) BY_CARD#444679***2722/#1280096054862572/TRN_TIME:27.05.25 00:00:00"
        }
      ]
    }
  ]
}
\`\`\`
`

	const userPrompt = `
Parse the following bank statement XML into the required JSON format:

\`\`\`xml
${statment}
\`\`\`
`
	console.log("getTransactions.systemPrompt", systemPrompt)
	console.log("getTransactions.userPrompt", userPrompt)

	const {text} = streamText({
		model: openrouter.chat("google/gemini-2.5-flash"),
		prompt: userPrompt,
		system: systemPrompt,
	})
	console.log("getTransactions.text:", await text)

	const jsonText = (await text).slice(7, -3)
	const json = JSON.parse(jsonText)
	console.log("getTransactions.json:", json)

	const transactions = transactionsSchema.parse(json)
	console.log("getTransactions.transactions:", transactions)

	return transactions
}
