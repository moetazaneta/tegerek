import {AnimatePresence, motion} from "motion/react"
import type {TransactionWithCurrency} from "@/convex/transactions"
import {formatCurrency} from "@/lib/currency"
import {cn} from "@/lib/utils"

export function TransactionList({
	transactions,
}: {
	transactions: TransactionWithCurrency[]
}) {
	const groups = Object.groupBy(transactions ?? [], t => t.date)

	return (
		<div className="flex flex-col max-w-[300px] w-[300px] shrink-0">
			<AnimatePresence mode="popLayout">
				{Object.entries(groups).map(([date, transactions], index) => (
					<motion.div key={`wrap-${date}`}>
						<motion.div
							layout
							key={date}
							data-first={index === 0}
							className={cn(
								"inline-block text-muted-foreground pl-2 pb-4 data-[first=false]:pt-6 text-sm font-semibold ",
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
