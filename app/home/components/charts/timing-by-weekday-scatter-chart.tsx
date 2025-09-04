import {getDay, getWeek} from "date-fns"
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
import {formatCurrency} from "@/lib/currency"

const chartConfig = {} satisfies ChartConfig

export function TimingByWeekdayScatterChart({
	transactions,
}: {
	transactions: TransactionWithCurrency[]
}) {
	const data = useMemo(() => {
		return transactions
			.filter(t => t.amount < 0)
			.map(t => ({
				weekNumber: getWeek(t.date),
				weekday: new Date(t.date).toLocaleDateString("en-US", {
					weekday: "short",
				}),
				amount: Math.round(Math.abs(t.amount)),
				transaction: t,
			}))
			.reduce(
				(acc, t) => {
					const existing = acc.find(
						e => e.weekday === t.weekday && e.weekNumber === t.weekNumber,
					)
					if (!existing) {
						acc.push({
							weekNumber: t.weekNumber,
							weekday: t.weekday,
							amount: Math.abs(t.transaction.amount),
							transactions: [t.transaction],
						})
					} else {
						existing.amount += Math.abs(t.transaction.amount)
						existing.transactions.push(t.transaction)
					}
					return acc
				},
				[] as {
					weekNumber: number
					weekday: string
					amount: number
					transactions: TransactionWithCurrency[]
				}[],
			)
			.sort(
				(a, b) =>
					getDay(a.transactions[0].date) - getDay(b.transactions[0].date),
			)
	}, [transactions])

	return (
		<ChartContainer config={chartConfig} className="h-full w-full">
			<ScatterChart>
				<CartesianGrid />
				<XAxis
					allowDuplicatedCategory={false}
					type="category"
					dataKey="weekday"
					name="weekday"
					padding={{left: 20, right: 20}}
					interval={0}
				/>
				<YAxis
					allowDuplicatedCategory={false}
					type="category"
					dataKey="weekNumber"
					name="weekNumber"
				/>
				<ZAxis type="number" dataKey="amount" range={[100, 1000]} />

				<ChartTooltip
					cursor={{strokeDasharray: "3 3"}}
					content={props => {
						const {active, payload} = props

						if (active && payload && payload.length) {
							const data = payload[0]?.payload
							const ts = data.transactions as TransactionWithCurrency[]

							return (
								<ChartTooltipContentWrap className="p-4 gap-4 max-w-[400px] min-w-[250px] overflow-hidden">
									<div className="flex justify-between items-center">
										<TransactionDateLabel
											className="font-[size:inherit]"
											date={ts[0].date}
										/>
										<div className="text-base">
											{formatCurrency(-data.amount, ts[0].currency)}
										</div>
									</div>

									{ts.map(t => (
										<TransactionCard
											key={t._id}
											className="p-0 text-base w-full min-w-0"
											transaction={t}
										/>
									))}
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
