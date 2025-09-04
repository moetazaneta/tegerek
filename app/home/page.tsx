"use client"

import {convexQuery} from "@convex-dev/react-query"
import {useQuery} from "@tanstack/react-query"
import {useState} from "react"
import {ExpensesDistributionTreeChart} from "@/app/home/components/charts/expenses-distribution-tree-chart"
import {TimingByDayHourScatterChart} from "@/app/home/components/charts/timing-by-day-hour-scatter-chart"
import {TimingByWeekdayScatterChart} from "@/app/home/components/charts/timing-by-weekday-scatter-chart"
import {Filters} from "@/app/home/components/filters"
import {TransactionList} from "@/app/home/components/transaction-list"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {api} from "@/convex/_generated/api"
import {cn} from "@/lib/utils"

export default function Home() {
	const [filters, setFilters] = useState<Filters>({})
	const {data: transactions, isFetching} = useQuery({
		...convexQuery(api.transactions.getMine, filters),
		placeholderData: prev => prev,
	})

	return (
		<div className="w-full grid grid-cols-[250px_300px_1fr] gap-8 min-h-0 h-full">
			<Filters value={filters} onChange={setFilters} />
			<TransactionList
				className={cn(isFetching && "opacity-50")}
				transactions={transactions ?? []}
			/>
			<Tabs defaultValue="timing" className="items-center min-w-0 pb-2">
				<TabsList>
					<TabsTrigger value="distribution">distribution</TabsTrigger>
					<TabsTrigger value="timing">timing</TabsTrigger>
				</TabsList>
				<div className={cn("w-full h-full", isFetching && "opacity-50")}>
					<TabsContent value="distribution" className="h-full">
						<ExpensesDistributionTreeChart transactions={transactions ?? []} />
					</TabsContent>
					<TabsContent value="timing" className="h-full w-full">
						<Tabs defaultValue="weekday" className="items-center h-full">
							<TabsList>
								<TabsTrigger value="hour">hour</TabsTrigger>
								<TabsTrigger value="weekday">weekday</TabsTrigger>
							</TabsList>
							<TabsContent value="hour" className="h-full w-full">
								<TimingByDayHourScatterChart
									transactions={transactions ?? []}
								/>
							</TabsContent>
							<TabsContent value="weekday" className="h-full w-full">
								<TimingByWeekdayScatterChart
									transactions={transactions ?? []}
								/>
							</TabsContent>
						</Tabs>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	)
}
