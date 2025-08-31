"use client"

import {autoPlacement, computePosition, offset} from "@floating-ui/react"
import {
	AnimatePresence,
	MotionConfig,
	motion,
	useMotionValue,
} from "motion/react"
import {
	type CSSProperties,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import {
	MorphingPopover,
	MorphingPopoverContent,
	MorphingPopoverTrigger,
} from "@/components/motion-primitives/morphing-popover"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import useClickOutside from "@/hooks/useClickOutside"

export default function Home() {
	return (
		<Card className="h-full w-[300px]">
			<CardContent className="h-full flex flex-col gap-8 justify-between items-start">
				<Morph />
				<MorphinPopoverExample />
				<Morph />
			</CardContent>
		</Card>
	)
}

function Morph() {
	const [isOpen, setIsOpen] = useState(false)

	const triggerRef = useRef<HTMLButtonElement>(null)
	const cardRef = useRef<HTMLDivElement>(null)
	useClickOutside(cardRef, () => setIsOpen(false))

	const id = useId()

	const offsetMain = -2
	const offsetCross = -2

	const x = useMotionValue(0)
	const y = useMotionValue(0)

	const popoverRefCallback = (popoverRef: HTMLDivElement | null) => {
		if (!popoverRef || !triggerRef.current) return

		popoverRef.style.position = "absolute"
		popoverRef.style.width = `${triggerRef.current.clientWidth}px`
		// popoverRef.style.height = `${triggerRef.current.clientHeight}px`
		popoverRef.style.transition = "all 0.4s ease"
		// popoverRef.style.gridTemplateRows = "0fr"
		popoverRef.style.gridTemplateRows = `${triggerRef.current.clientHeight}px`

		computePosition(triggerRef.current, popoverRef, {
			placement: "right-end",
			middleware: [
				autoPlacement({
					allowedPlacements: [
						"bottom-start",
						"top-start",
						"bottom-end",
						"top-end",
					],
				}),
				// 1------2
				// |      |
				// 4------3
				// 1: bottom-start right-start
				// 2: bottom-end left-start
				// 3: top-end left-end
				// 4: top-start right-end
				offset(({rects, placement}) => {
					const mainAxis =
						placement.includes("bottom") || placement.includes("top")
							? -rects.reference.height + offsetMain
							: -rects.reference.width + offsetCross
					return {
						mainAxis,
						crossAxis: offsetCross,
					}
				}),
			],
		}).then(pos => {
			popoverRef.style.top = `${pos.y}px`
			popoverRef.style.left = `${pos.x}px`
			// setTimeout(() => {
			popoverRef.style.gridTemplateRows = "1fr"
			popoverRef.style.width = "auto"
			// popoverRef.style.height = `calc-value(auto)`
			// }, 500)

			x.set(pos.x)
			y.set(pos.y)
		})
	}

	return (
		<Button
			ref={triggerRef}
			variant="outline"
			onClick={() => setIsOpen(v => !v)}
		>
			<motion.span
				key={`morph-button-label-${id}`}
				layoutId={`morph-button-label-${id}`}
				layout="position"
			>
				Example button
			</motion.span>
			{isOpen && (
				<div
					key={"popover"}
					className="grid grid-template-rows-[0fr] transition-all duration-400 overflow-hidden"
					ref={popoverRefCallback}
					// style={{position: "absolute"}}
				>
					<Card ref={cardRef} className="w-full h-full ">
						<CardHeader>
							<CardTitle>
								<motion.span
									layoutId={`morph-button-label-${id}`}
									layout="position"
								>
									Cute little poppy
								</motion.span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div>It's not a typo</div>
						</CardContent>
					</Card>
				</div>
			)}
		</Button>
	)
}

function Morph1() {
	const [isOpen, setIsOpen] = useState(false)

	const triggerRef = useRef<HTMLDivElement>(null)
	const cardRef = useRef<HTMLDivElement>(null)
	useClickOutside(cardRef, () => setIsOpen(false))

	const id = useId()

	const [layoutId, setLayoutId] = useState(useId())

	const [styles, setStyles] = useState<CSSProperties>({})

	const [isPositioned, setIsPositioned] = useState(false)

	const offsetMain = -2
	const offsetCross = -2

	const x = useMotionValue(0)
	const y = useMotionValue(0)

	useLayoutEffect(() => {
		console.log("useLayoutEffect", isOpen)
	}, [isOpen])

	const popoverRefCallback = (popoverRef: HTMLDivElement | null) => {
		console.log("popoverRefCallback", popoverRef, triggerRef.current)
		if (!popoverRef || !triggerRef.current) return

		// popoverRef.style.display = "none"

		// setIsOpen(false)

		computePosition(triggerRef.current, popoverRef, {
			placement: "right-end",
			middleware: [
				// flip(), not flip but
				autoPlacement({
					// alignment:
					allowedPlacements: [
						"bottom-start",
						"top-start",
						"bottom-end",
						"top-end",
					],
				}),
				// 1------2
				// |      |
				// 4------3
				// 1: bottom-start right-start
				// 2: bottom-end left-start
				// 3: top-end left-end
				// 4: top-start right-end
				offset(({rects, placement}) => {
					const mainAxis =
						placement.includes("bottom") || placement.includes("top")
							? -rects.reference.height + offsetMain
							: -rects.reference.width + offsetCross
					return {
						mainAxis,
						crossAxis: offsetCross,
					}
				}),
			],
		}).then(pos => {
			console.log(pos)
			// popoverRef.style.display = "block"
			// popoverRef.style.height = `${pos.y}px`
			// popoverRef.style.top = `${pos.y}px`
			// popoverRef.style.left = `${pos.x}px`

			setStyles({top: pos.y, left: pos.x})
			// x.(pos.x)
			x.set(pos.x)
			y.set(pos.y)

			// setLayoutId(`morph-button-trigger-${id}`)
			// setTimeout(() => {
			// requestAnimationFrame(() => {
			// setIsOpen(true)
			setIsPositioned(true)
			// })
			// }, 300)
		})
	}

	return (
		<MotionConfig
			transition={{
				duration: 0.4,
				// delay: 0.5,
			}}
		>
			<Button asChild variant="outline" onClick={() => setIsOpen(v => !v)}>
				<motion.div
					// key={"trigger"}
					ref={triggerRef}
					// layoutId={`morph-button-trigger-${id}`}
					// layout="size"

					// layoutDependency={isPositioned}
				>
					<motion.span layoutId={`morph-button-label-${id}`} layout="position">
						Example button
					</motion.span>
				</motion.div>
			</Button>
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							key={"popover"}
							className="absolute! z-100"
							ref={popoverRefCallback}
							// layoutId={`morph-button-trigger-${id}`}
							style={{
								top: y,
								left: x,
							}}
							// style={styles}
							// initial={{
							// 	top: y.get(),
							// 	left: x.get(),
							// }}
							// animate={{
							// 	top: y.get(),
							// 	left: x.get(),
							// }}
							// transition={{when: "beforeChildren"}}
							// layoutDependency={isPositioned}
						>
							<Card ref={cardRef} className="w-[300px]">
								<CardHeader>
									<CardTitle>
										<motion.span
											layoutId={`morph-button-label-${id}`}
											layout="position"
										>
											Cute little poppy
										</motion.span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<motion.div>
										<div>It's not a typo</div>
									</motion.div>
								</CardContent>
							</Card>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</MotionConfig>
	)
}

function MorphinPopoverExample() {
	// const [isOpen, setIsOpen] = useState(false)

	return (
		<MorphingPopover
		// transition={{
		// 	type: "spring",
		// 	bounce: 0.05,
		// 	duration: 2,
		// }}
		// open={isOpen}
		// onOpenChange={setIsOpen}
		>
			<MorphingPopoverTrigger asChild>
				<Button variant="og">
					<motion.span layoutId="morph-popover-text" layout="position">
						Morphing popover
					</motion.span>
				</Button>
			</MorphingPopoverTrigger>
			<MorphingPopoverContent>
				<motion.span layoutId="morph-popover-text" layout="position">
					Cute little poppy
				</motion.span>
				{/* <Card>
					<CardHeader>
						<CardTitle>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<motion.div>
							<div>It's not a typo</div>
						</motion.div>
					</CardContent>
				</Card> */}
			</MorphingPopoverContent>
		</MorphingPopover>
	)
}
