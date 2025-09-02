"use client"

import {autoPlacement, computePosition, offset} from "@floating-ui/react"
import {UploadIcon} from "lucide-react"
import {AnimatePresence, motion} from "motion/react"
import {
	createContext,
	type ReactNode,
	useContext,
	useRef,
	useState,
} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Dropzone} from "@/components/ui/shadcn-io/dropzone"
import useClickOutside from "@/hooks/useClickOutside"
import {cn} from "@/lib/utils"

export default function Home() {
	return (
		<Card className="h-full w-[300px]">
			<CardContent className="h-full flex flex-col gap-8 justify-between items-start">
				{/* <MorphingOverlay>
					<MorphingOverlayTrigger className="flex flex-col items-center justify-center">
						<MorphingOverlayTriggerContent>Open</MorphingOverlayTriggerContent>
						<MorphingOverlayContent>
							<div>Overlay content</div>
							<div>Overlay content</div>
							<div>Overlay content</div>
						</MorphingOverlayContent>
					</MorphingOverlayTrigger>
				</MorphingOverlay>
				<MorphingOverlay>
					<MorphingOverlayTrigger className="flex flex-col items-center justify-center">
						<MorphingOverlayTriggerContent>Open</MorphingOverlayTriggerContent>
						<MorphingOverlayContent>
							<div>Overlay content</div>
							<div>Overlay content</div>
						</MorphingOverlayContent>
					</MorphingOverlayTrigger>
				</MorphingOverlay> */}
				<MorphingImportButton />
			</CardContent>
		</Card>
	)
}

function MorphingImportButton() {
	return (
		<AnimatePresence>
			<MorphingOverlay>
				<MorphingOverlayTrigger className="flex flex-col items-center justify-center">
					<MorphingOverlayTriggerContent>
						<motion.span layoutId="import-button">Import</motion.span>
					</MorphingOverlayTriggerContent>
					<MorphingOverlayContent>
						<motion.div
							className="flex flex-col gap-8 p-4 items-start"
							initial={{opacity: 0, scale: 0.8}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.8}}
						>
							<div className="font-bold text-xl self-center">
								<motion.span layoutId="import-button">
									Import statement
								</motion.span>
							</div>
							<Dropzone
								accept={{
									"text/xml": [".xml"],
								}}
								maxFiles={1}
								maxSize={1024 * 1024 * 10}
								// onDrop={handleDrop}
								className={cn(
									"relative border-4 border-dashed  squircle-xl w-full",
									// isPending && "bg-stone-100 animate-pulse",
								)}
							>
								<div className="flex flex-col gap-8 items-center">
									<div className="flex flex-row gap-4 items-center">
										<UploadIcon
											size={32}
											strokeWidth={2}
											strokeLinecap="butt"
										/>

										<p className="text-lg">Drop file here</p>
									</div>
								</div>
							</Dropzone>
							<div className="flex flex-col gap-2 mt-4 items-start">
								<p className="text-muted-foreground text-xs">
									* AI fail sometimes.
								</p>
								<p className="text-muted-foreground text-xs">
									** Only support XML yet.
								</p>
							</div>
						</motion.div>
					</MorphingOverlayContent>
				</MorphingOverlayTrigger>
			</MorphingOverlay>
		</AnimatePresence>
	)
}

function MorphingImportButton1() {
	return (
		<MorphingOverlay>
			<MorphingOverlayTrigger className="flex flex-col items-center justify-center">
				<MorphingOverlayTriggerContent>Import</MorphingOverlayTriggerContent>
				<MorphingOverlayContent>
					<div className="flex flex-col gap-8 p-4">
						<div className="font-bold text-2xl">Import statement</div>
						<Dropzone
							accept={{
								"text/xml": [".xml"],
							}}
							maxFiles={1}
							maxSize={1024 * 1024 * 10}
							// onDrop={handleDrop}
							className={cn(
								"relative border-4 border-dashed  squircle-xl w-full",
								// isPending && "bg-stone-100 animate-pulse",
							)}
						>
							<div className="flex flex-col gap-8 items-center">
								<div className="flex flex-row gap-4 items-center">
									<UploadIcon size={32} strokeWidth={2} strokeLinecap="butt" />

									<p className="text-lg">Drop file here</p>
								</div>
							</div>
						</Dropzone>
						<div className="flex flex-col gap-2 mt-4">
							<p className="text-muted-foreground text-xs">
								* I use AI to extract the data, so it can fail sometimes.
							</p>
							<p className="text-muted-foreground text-xs">
								** We only support XML yet.
							</p>
						</div>
					</div>
				</MorphingOverlayContent>
			</MorphingOverlayTrigger>
		</MorphingOverlay>
	)
}

export type MorphingOverlayContextType = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	triggerRef: React.RefObject<HTMLButtonElement | null>
	triggerContentRef: React.RefObject<HTMLDivElement | null>
	wrapRef: React.RefObject<HTMLDivElement | null>
}

const MorphingOverlayContext = createContext<MorphingOverlayContextType | null>(
	null,
)

function MorphingOverlayProvider({children}: {children: React.ReactNode}) {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const triggerContentRef = useRef<HTMLDivElement>(null)
	const wrapRef = useRef<HTMLDivElement>(null)

	return (
		<MorphingOverlayContext.Provider
			value={{isOpen, setIsOpen, triggerRef, triggerContentRef, wrapRef}}
		>
			{children}
		</MorphingOverlayContext.Provider>
	)
}

function MorphingOverlayWrap({children}: {children: ReactNode}) {
	const context = useContext(MorphingOverlayContext)
	if (!context) {
		throw new Error(
			"MorphingOverlayWrap must be used within MorphingOverlayProvider",
		)
	}

	return (
		<div ref={context.wrapRef} className="relative">
			{children}
		</div>
	)
}

function MorphingOverlay({children}: {children: ReactNode}) {
	return (
		<MorphingOverlayProvider>
			<MorphingOverlayWrap>{children}</MorphingOverlayWrap>
		</MorphingOverlayProvider>
	)
}

function MorphingOverlayTrigger({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	const context = useContext(MorphingOverlayContext)
	if (!context) {
		throw new Error(
			"MorphingOverlayTrigger must be used within MorphingOverlay",
		)
	}

	useClickOutside(context.triggerRef, () => {
		context.setIsOpen(false)
	})

	return (
		<Button
			ref={context.triggerRef}
			onClick={() => context.setIsOpen(true)}
			variant="og"
			className={cn(
				"bg-background",
				context.isOpen &&
					"border-border text-foreground border-4 squircle-[32px]",
				className,
			)}
		>
			{children}
		</Button>
	)
}

function MorphingOverlayTriggerContent({children}: {children: ReactNode}) {
	const context = useContext(MorphingOverlayContext)
	if (!context) {
		throw new Error(
			"MorphingOverlayTriggerContent must be used within MorphingOverlay",
		)
	}

	console.log(
		"MorphingOverlayTriggerContent",
		context.triggerContentRef.current,
	)

	return <div ref={context.triggerContentRef}>{children}</div>
}

function MorphingOverlayContent({children}: {children: ReactNode}) {
	const context = useContext(MorphingOverlayContext)
	if (!context) {
		throw new Error(
			"MorphingOverlayContent must be used within MorphingOverlay",
		)
	}

	const {triggerRef, wrapRef, isOpen, triggerContentRef} = context

	const popoverRefCallback = (popoverRef: HTMLDivElement | null) => {
		console.log(
			"popoverRefCallback",
			triggerRef.current,
			wrapRef.current,
			triggerContentRef.current,
		)
		if (!triggerRef.current || !wrapRef.current || !triggerContentRef.current)
			return

		triggerRef.current.style.transition = `all .2s ease`
		triggerRef.current.style.overflow = `hidden`
		triggerRef.current.style.removeProperty(`width`)
		triggerRef.current.style.removeProperty(`height`)

		if (!popoverRef) {
			const initialWidth = triggerRef.current.offsetWidth
			const initialHeight = triggerRef.current.offsetHeight

			triggerRef.current.style.width = `auto`
			triggerRef.current.style.height = `auto`
			triggerContentRef.current.style.display = `block`

			requestAnimationFrame(() => {
				if (!triggerRef.current) return
				const colapsedWidth = triggerRef.current.offsetWidth
				const colapsedHeight = triggerRef.current.offsetHeight

				triggerRef.current.style.width = `${initialWidth}px`
				triggerRef.current.style.height = `${initialHeight}px`

				requestAnimationFrame(() => {
					if (!triggerRef.current) return
					triggerRef.current.style.width = `${colapsedWidth}px`
					triggerRef.current.style.height = `${colapsedHeight}px`
				})
			})

			return
		}

		popoverRef.style.position = `absolute`
		const initialWidth = triggerRef.current.offsetWidth
		const initialHeight = triggerRef.current.offsetHeight

		popoverRef.style.position = `relative`
		triggerContentRef.current.style.display = `none`
		const newWidth = triggerRef.current.offsetWidth
		const newHeight = triggerRef.current.offsetHeight

		wrapRef.current.style.width = `${initialWidth}px`
		wrapRef.current.style.height = `${initialHeight}px`

		// 1------2
		// |      |
		// 4------3
		// 1: bottom-start right-start
		// 2: bottom-end left-start
		// 3: top-end left-end
		// 4: top-start right-end
		computePosition(wrapRef.current, triggerRef.current, {
			placement: "bottom-end",
			middleware: [
				autoPlacement({
					allowedPlacements: [
						"bottom-start",
						"top-start",
						"bottom-end",
						"top-end",
					],
				}),
				offset(({rects, placement}) => {
					const mainAxis =
						placement.includes("bottom") || placement.includes("top")
							? -rects.reference.height
							: -rects.reference.width
					return {
						mainAxis,
					}
				}),
			],
		}).then(pos => {
			if (!popoverRef || !triggerRef.current) return

			triggerRef.current.style.width = `${initialWidth}px`
			triggerRef.current.style.height = `${initialHeight}px`

			requestAnimationFrame(() => {
				if (!triggerRef.current) return
				triggerRef.current.style.width = `${newWidth}px`
				triggerRef.current.style.height = `${newHeight}px`
			})

			triggerRef.current.style.position = `absolute`
			if (pos.placement === "bottom-start") {
				triggerRef.current.style.top = "0"
				triggerRef.current.style.left = "0"
			} else if (pos.placement === "bottom-end") {
				triggerRef.current.style.top = "0"
				triggerRef.current.style.right = "0"
			} else if (pos.placement === "top-start") {
				triggerRef.current.style.bottom = "0"
				triggerRef.current.style.left = "0"
			} else if (pos.placement === "top-end") {
				triggerRef.current.style.bottom = "0"
				triggerRef.current.style.right = "0"
			}
		})
	}

	if (!isOpen) {
		return null
	}

	return <div ref={popoverRefCallback}>{children}</div>
}

function Morph() {
	const [isOpen, setIsOpen] = useState(false)

	const wrapRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const cardRef = useRef<HTMLDivElement>(null)
	useClickOutside(cardRef, () => setIsOpen(false))

	const popoverRefCallback = (popoverRef: HTMLDivElement | null) => {
		if (!triggerRef.current || !wrapRef.current) return

		triggerRef.current.style.transition = `all .2s ease`
		triggerRef.current.style.overflow = `hidden`
		triggerRef.current.style.removeProperty(`width`)
		triggerRef.current.style.removeProperty(`height`)

		if (!popoverRef) {
			const initialWidth = triggerRef.current.offsetWidth
			const initialHeight = triggerRef.current.offsetHeight

			triggerRef.current.style.width = `auto`
			triggerRef.current.style.height = `auto`

			requestAnimationFrame(() => {
				if (!triggerRef.current) return
				const colapsedWidth = triggerRef.current.offsetWidth
				const colapsedHeight = triggerRef.current.offsetHeight

				triggerRef.current.style.width = `${initialWidth}px`
				triggerRef.current.style.height = `${initialHeight}px`

				requestAnimationFrame(() => {
					if (!triggerRef.current) return
					triggerRef.current.style.width = `${colapsedWidth}px`
					triggerRef.current.style.height = `${colapsedHeight}px`
				})
			})

			return
		}

		popoverRef.style.position = `absolute`
		const initialWidth = triggerRef.current.offsetWidth
		const initialHeight = triggerRef.current.offsetHeight

		popoverRef.style.position = `relative`
		const newWidth = triggerRef.current.offsetWidth
		const newHeight = triggerRef.current.offsetHeight

		wrapRef.current.style.width = `${initialWidth}px`
		wrapRef.current.style.height = `${initialHeight}px`

		// 1------2
		// |      |
		// 4------3
		// 1: bottom-start right-start
		// 2: bottom-end left-start
		// 3: top-end left-end
		// 4: top-start right-end
		computePosition(wrapRef.current, triggerRef.current, {
			placement: "bottom-end",
			middleware: [
				autoPlacement({
					allowedPlacements: [
						"bottom-start",
						"top-start",
						"bottom-end",
						"top-end",
					],
				}),
				offset(({rects, placement}) => {
					const mainAxis =
						placement.includes("bottom") || placement.includes("top")
							? -rects.reference.height
							: -rects.reference.width
					return {
						mainAxis,
					}
				}),
			],
		}).then(pos => {
			if (!popoverRef || !triggerRef.current) return

			triggerRef.current.style.width = `${initialWidth}px`
			triggerRef.current.style.height = `${initialHeight}px`

			requestAnimationFrame(() => {
				if (!triggerRef.current) return
				triggerRef.current.style.width = `${newWidth}px`
				triggerRef.current.style.height = `${newHeight}px`
			})

			triggerRef.current.style.position = `absolute`
			if (pos.placement === "bottom-start") {
				triggerRef.current.style.top = "0"
				triggerRef.current.style.left = "0"
			} else if (pos.placement === "bottom-end") {
				triggerRef.current.style.top = "0"
				triggerRef.current.style.right = "0"
			} else if (pos.placement === "top-start") {
				triggerRef.current.style.bottom = "0"
				triggerRef.current.style.left = "0"
			} else if (pos.placement === "top-end") {
				triggerRef.current.style.bottom = "0"
				triggerRef.current.style.right = "0"
			}
		})
	}

	return (
		<div ref={wrapRef} className="relative">
			<Button
				ref={triggerRef}
				variant="outline"
				onClick={() => setIsOpen(v => !v)}
				className="flex flex-col"
			>
				button
				{isOpen && (
					<div key={"popover"} ref={popoverRefCallback}>
						<div>popover content</div>
						<div>popover content</div>
						<div>popover content</div>
						<div>popover content</div>
						<div>popover content</div>
					</div>
				)}
			</Button>
		</div>
	)
}
