"use client"

import {convexQuery} from "@convex-dev/react-query"
import {useQuery} from "@tanstack/react-query"
import {useState} from "react"
import {Filters} from "@/app/home/components/filters"
import {ScatterChartByDate} from "@/app/home/components/scatter-chart"
import {TransactionList} from "@/app/home/components/transaction-list"
import {TreeChart} from "@/app/home/components/tree-chart"
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
			<Tabs defaultValue="ScatterChart" className="items-center min-w-0">
				<TabsList>
					<TabsTrigger value="TreeChart">distribution</TabsTrigger>
					<TabsTrigger value="ScatterChart">timing</TabsTrigger>
				</TabsList>
				<div className={cn("w-full", isFetching && "opacity-50")}>
					<TabsContent value="TreeChart">
						<TreeChart transactions={transactions ?? []} />
					</TabsContent>
					<TabsContent value="ScatterChart">
						<ScatterChartByDate transactions={transactions ?? []} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	)
}
