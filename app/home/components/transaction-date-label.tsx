import {type MotionProps, motion} from "motion/react"
import {cn} from "@/lib/utils"

export function TransactionDateLabel({
	date,
	time,
	showTime = false,
	className,
	...props
}: {
	date: string
	time?: string
	showTime?: boolean
	className?: string
} & MotionProps) {
	return (
		<motion.div
			{...props}
			className={cn(
				"inline-block text-muted-foreground text-sm font-semibold ",
				className,
			)}
		>
			{new Date(date).toLocaleDateString()}
			{showTime && time && <span> {time}</span>}
		</motion.div>
	)
}
