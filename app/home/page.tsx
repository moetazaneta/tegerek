"use client"

import type {ApexOptions} from "apexcharts"
import {useQuery} from "convex/react"
import ApexChart from "react-apexcharts"
import {api} from "@/convex/_generated/api"
import {formatCurrency} from "@/lib/currency"

export default function Home() {
	return (
		<div className="flex flex-row gap-4">
			<TransactionList />
			<TreeChart />
		</div>
	)
}

function TransactionList() {
	const transactions = useQuery(api.transactions.getMine)
	const groups = Object.groupBy(transactions ?? [], t => t.date)

	return (
		<div className="flex flex-col w-full max-w-[300px]">
			{Object.entries(groups).map(([date, transactions]) => (
				<>
					<div
						key={date}
						className="text-muted-foreground pl-2 pb-4 pt-6 text-sm font-semibold sticky top-0 bg-gradient-to-b from-white to-transparent from-60%"
					>
						{new Date(date).toLocaleDateString()}
					</div>

					{transactions?.map(t => (
						<div
							className="flex flex-row gap-1 justify-between items-center px-2 hover:bg-stone-100 squircle-xl"
							key={t._id}
						>
							<div className="flex flex-col min-w-0 gap-0 py-2">
								<div className="font-bold truncate">{t.merchant}</div>
								<div className="text-muted-foreground">
									{t.category}
									{t.tags && t.tags.length > 0 && `, ${t.tags.join(", ")}`}
								</div>
							</div>
							<div className="text-right whitespace-nowrap tabular-nums">
								{formatCurrency(t.amount, t.currency)}
							</div>
						</div>
					))}
				</>
			))}
		</div>
	)
}

function TreeChart() {
	const transactions = useQuery(api.transactions.getMine)

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
		<ApexChart
			options={options}
			series={series}
			type="treemap"
			height={500}
			width={500}
		/>
	)
}
