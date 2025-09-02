"use client"

import {convexQuery} from "@convex-dev/react-query"
import {useQuery} from "@tanstack/react-query"
import {useState} from "react"
import {Filters} from "@/app/home/filters"
import {TransactionList} from "@/app/home/transaction-list"
import {TreeChart} from "@/app/home/tree-chart"
import {api} from "@/convex/_generated/api"
import {cn} from "@/lib/utils"

export default function Home() {
	const [filters, setFilters] = useState<Filters>({})
	const {data: transactions, isFetching} = useQuery({
		...convexQuery(api.transactions.getMine, filters),
		placeholderData: prev => prev,
	})

	return (
		<div className="flex flex-row gap-4 min-h-0 h-full w-[1032px] justify-center">
			<Filters value={filters} onChange={setFilters} />
			<div
				className={cn(
					"flex flex-row gap-4 transition-opacity",
					isFetching && "opacity-50",
				)}
			>
				<TransactionList transactions={transactions ?? []} />
				<TreeChart transactions={transactions ?? []} />
			</div>
		</div>
	)
}
