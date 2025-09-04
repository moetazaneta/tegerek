import type {ApexOptions} from "apexcharts"
import ApexChart from "react-apexcharts"
import type {TransactionWithCurrency} from "@/convex/transactions"
import {formatCurrency} from "@/lib/currency"

export function ExpensesDistributionTreeChart({
	transactions,
}: {
	transactions: TransactionWithCurrency[]
}) {
	const creditTransactions = (transactions ?? []).filter(t => t.amount < 0)

	const transactionsByCategory = Object.groupBy(
		creditTransactions,
		t => t.category,
	)

	const series: ApexNonAxisChartSeries = Object.entries(
		transactionsByCategory,
	).map(([category, transactions]) => {
		const transactionsByMerchant = Object.groupBy(
			transactions ?? [],
			t => t.merchant,
		)
		const data = Object.entries(transactionsByMerchant).map(
			([merchant, transactions]) => ({
				x: merchant,
				y: (transactions ?? [])
					.reduce((acc, t) => acc + Math.abs(t.amount), 0)
					.toFixed(2),
			}),
		)
		return {
			name: category,
			data,
		}
	})

	const options: ApexOptions = {
		chart: {
			toolbar: {
				show: false,
			},
		},
		tooltip: {
			enabled: true,
			y: {
				formatter: (value: number) => formatCurrency(value, "USD", "never"),
			},
		},
	}

	return (
		<div className="relative h-full">
			<ApexChart
				options={options}
				series={series}
				type="treemap"
				height="100%"
				className="relative -top-[20px] w-full h-full"
			/>
		</div>
	)
}
