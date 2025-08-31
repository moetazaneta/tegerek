"use client"

import {convexQuery} from "@convex-dev/react-query"
import {useQuery} from "@tanstack/react-query"
import type {ApexOptions} from "apexcharts"
import {AnimatePresence, motion} from "motion/react"
import {useState} from "react"
import ApexChart from "react-apexcharts"
import {Combobox} from "@/components/ui/combobox"
import {api} from "@/convex/_generated/api"
import type {Id} from "@/convex/_generated/dataModel"
import type {TransactionWithCurrency} from "@/convex/transactions"
import {formatCurrency} from "@/lib/currency"
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
					isFetching && "opacity-50 ",
				)}
			>
				<TransactionList transactions={transactions ?? []} />
				<TreeChart transactions={transactions ?? []} />
			</div>
		</div>
	)
}

function TransactionList({
	transactions,
}: {
	transactions: TransactionWithCurrency[]
}) {
	const groups = Object.groupBy(transactions ?? [], t => t.date)

	return (
		<div className="flex flex-col max-w-[300px] w-[300px] shrink-0">
			<AnimatePresence mode="popLayout">
				{Object.entries(groups).map(([date, transactions]) => (
					<motion.div key={`wrap-${date}`} layout>
						<motion.div
							layout
							key={date}
							className={cn(
								"inline-block text-muted-foreground pl-2 pb-4 not-first:pt-6 text-sm font-semibold ",
							)}
							initial={{opacity: 0, scale: 0.75}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.75}}
							transition={{
								duration: 0.5,
								type: "spring",
								bounce: 0.1,
							}}
						>
							{new Date(date).toLocaleDateString()}
						</motion.div>
						{transactions?.map(t => (
							<motion.div
								className="flex flex-row gap-1 justify-between items-center px-2 hover:bg-stone-100 squircle-xl"
								key={t._id}
								layout
								initial={{opacity: 0, scale: 0.9}}
								animate={{opacity: 1, scale: 1}}
								exit={{opacity: 0, scale: 0.9}}
								transition={{
									duration: 0.5,
									type: "spring",
									bounce: 0.1,
								}}
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
							</motion.div>
						))}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}

type Filters = {
	categories?: Id<"categories">[]
}

function Filters({
	value,
	onChange,
}: {
	value: Filters
	onChange: (f: Filters) => void
}) {
	const {categories} = value
	return (
		<div className="flex flex-col gap-2 w-[250px]">
			<CategoryCombobox
				value={categories}
				onChange={categories => onChange({...value, categories})}
			/>
		</div>
	)
}

function CategoryCombobox({
	value,
	onChange,
}: {
	value?: Id<"categories">[]
	onChange: (value: Id<"categories">[]) => void
}) {
	const {data: categories} = useQuery(convexQuery(api.categories.getMine, {}))
	const options = (categories ?? []).map(c => ({
		label: c.name,
		value: c._id,
	}))

	return (
		<Combobox
			placeholder="Select a category"
			className="w-[250px]"
			options={options}
			value={value}
			onChange={onChange}
		/>
	)
}

function TreeChart({transactions}: {transactions: TransactionWithCurrency[]}) {
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
		<div className="relative">
			<ApexChart
				options={options}
				series={series}
				type="treemap"
				height={520}
				width={500}
				className="-mt-[20px]"
			/>
		</div>
	)
}
