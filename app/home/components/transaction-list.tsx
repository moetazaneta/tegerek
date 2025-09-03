import {AnimatePresence, motion} from "motion/react"
import {TransactionCard} from "@/app/home/components/transaction-card"
import {TransactionDateLabel} from "@/app/home/components/transaction-date-label"
import type {TransactionWithCurrency} from "@/convex/transactions"
import {cn} from "@/lib/utils"

export function TransactionList({
	transactions,
	className,
}: {
	transactions: TransactionWithCurrency[]
	className?: string
}) {
	const groups = Object.groupBy(transactions ?? [], t => t.date)

	return (
		<div
			className={cn(
				"flex flex-col max-w-[300px] w-[300px] shrink-0 overflow-y-auto",
				className,
			)}
		>
			<AnimatePresence mode="popLayout">
				{Object.entries(groups).map(([date, transactions], index) => (
					<motion.div key={`wrap-${date}`}>
						<TransactionDateLabel
							date={date}
							key={date}
							data-first={index === 0}
							className="pl-2 pb-4 data-[first=false]:pt-6 "
							initial={{opacity: 0, scale: 0.75}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.75}}
							transition={{
								duration: 0.5,
								type: "spring",
								bounce: 0.1,
							}}
						/>
						{transactions?.map(t => (
							<TransactionCard
								layout
								initial={{opacity: 0, scale: 0.9}}
								animate={{opacity: 1, scale: 1}}
								exit={{opacity: 0, scale: 0.9}}
								transition={{
									duration: 0.5,
									type: "spring",
									bounce: 0.1,
								}}
								key={t._id}
								transaction={t}
							/>
						))}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}
