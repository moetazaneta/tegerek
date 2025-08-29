export function formatCurrency(
	amount: number,
	currency: string,
	signDisplay: keyof Intl.NumberFormatOptionsSignDisplayRegistry = "exceptZero",
) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		currencyDisplay: "narrowSymbol",
		currencySign: "standard",
		signDisplay,
	}).format(amount)
}
