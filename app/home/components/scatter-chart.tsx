import {useMemo} from "react"
import {
	CartesianGrid,
	Scatter,
	ScatterChart,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts"
import {TransactionCard} from "@/app/home/components/transaction-card"
import {TransactionDateLabel} from "@/app/home/components/transaction-date-label"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContentWrap,
} from "@/components/ui/chart"
import type {TransactionWithCurrency} from "@/convex/transactions"

const chartConfig = {} satisfies ChartConfig

export function ScatterChartByDate({
	transactions,
}: {
	transactions: TransactionWithCurrency[]
}) {
	const data = useMemo(() => {
		return transactions.map(t => ({
			y: t.date,
			x: t.time ? parseInt(t.time.split(":")[0]) : 1,
			z: Math.round(Math.abs(t.amount)),
			transaction: t,
		}))
	}, [transactions])

	return (
		<ChartContainer config={chartConfig} className="h-[900px] w-full">
			<ScatterChart
				margin={{
					top: 20,
					right: 20,
					bottom: 20,
					left: 20,
				}}
			>
				<CartesianGrid />
				<XAxis
					allowDuplicatedCategory={false}
					type="number"
					dataKey="x"
					name="time"
					padding={{left: 20, right: 20}}
					range={[0, 24]}
				/>
				<YAxis
					allowDuplicatedCategory={false}
					type="category"
					dataKey="y"
					name="date"
				/>
				<ZAxis type="number" dataKey="z" range={[100, 1000]} />

				<ChartTooltip
					cursor={{strokeDasharray: "3 3"}}
					content={props => {
						const {active, payload} = props

						if (active && payload && payload.length) {
							const data = payload[0]?.payload
							const t = data.transaction as TransactionWithCurrency

							return (
								<ChartTooltipContentWrap className="p-4 gap-4 max-w-[400px] min-w-[250px] overflow-hidden">
									<TransactionDateLabel
										className="font-[size:inherit]"
										date={t.date}
										time={t.time ?? "Unknown time"}
										showTime={true}
									/>
									<TransactionCard
										className="p-0 text-base w-full min-w-0"
										transaction={t}
									/>
								</ChartTooltipContentWrap>
							)
						}

						return null
					}}
				/>
				<Scatter name="Expenses" data={data} fill="#8884d8" />
			</ScatterChart>
		</ChartContainer>
	)
}
