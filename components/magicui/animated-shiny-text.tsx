import type {ComponentPropsWithoutRef, CSSProperties, FC} from "react"

import {cn} from "@/lib/utils"

export interface AnimatedShinyTextProps
	extends ComponentPropsWithoutRef<"span"> {
	shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
	children,
	className,
	shimmerWidth = 100,
	...props
}) => {
	return (
		<span
			style={
				{
					"--shiny-width": `${shimmerWidth}px`,
				} as CSSProperties
			}
			className={cn(
				"mx-auto max-w-md text-transparent",

				// Shine effect
				"bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

				// Shine gradient
				"animate-shiny-text bg-gradient-to-r from-muted-foreground/80 via-black to-muted-foreground/80",

				className,
			)}
			{...props}
		>
			{children}
		</span>
	)
}
