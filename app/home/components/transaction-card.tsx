import {type MotionProps, motion} from "motion/react"
import type {TransactionWithCurrency} from "@/convex/transactions"
import {formatCurrency} from "@/lib/currency"
import {cn} from "@/lib/utils"

export function TransactionCard({
	transaction: t,
	className,
}: {
	className?: string
	transaction: TransactionWithCurrency
} & MotionProps) {
	return (
		<motion.div
			className={cn(
				"flex flex-row gap-1 justify-between items-center p-2 hover:bg-stone-100 squircle-xl",
				className,
			)}
		>
			<div className="flex flex-col min-w-0 gap-0">
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
	)
}
