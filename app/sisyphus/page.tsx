"use client"

import {convexQuery} from "@convex-dev/react-query"
import {
	autoUpdate,
	computePosition,
	flip,
	offset,
	size,
	useFloating,
} from "@floating-ui/react"
import {useQuery} from "@tanstack/react-query"
import {
	AnimatePresence,
	MotionConfig,
	motion,
	transform,
	useIsomorphicLayoutEffect,
} from "motion/react"
import {useEffect, useId, useRef, useState} from "react"
import {id} from "zod/v4/locales"
import {
	MorphingPopover,
	MorphingPopoverContent,
	MorphingPopoverTrigger,
} from "@/components/motion-primitives/morphing-popover"
import {Combobox, SelectedOptions} from "@/components/ui/combobox"
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {api} from "@/convex/_generated/api"
import type {Id} from "@/convex/_generated/dataModel"

export default function Home() {
	const [categories, setCategories] = useState<Id<"categories">[]>([])

	return (
		<div className="h-full w-[250px] flex flex-col gap-4 justify-between p-0 scroll-auto">
			{/* <AnimatedList /> */}
			<CategoryFloatingSelect value={categories} onChange={setCategories} />
			{/* <BaseUiSelect />
			<CategoryCombobox value={categories} onChange={setCategories} />
			<FancyCombobox />
			<CategoryCombobox value={categories} onChange={setCategories} />
			<BaseUiSelect /> */}
			<CategoryFloatingSelect value={categories} onChange={setCategories} />
		</div>
	)
}

export function AnimatedList() {
	const [items, setItems] = useState<number[]>([])

	const addItem = () => {
		setItems(prev => [...prev, prev.length + 1])
	}

	return (
		<div style={{padding: "20px"}}>
			<button onClick={addItem}>Add Item</button>

			{/* Parent container with layout animation */}
			<motion.div
				layout
				transition={{duration: 0.4, ease: "easeInOut"}}
				style={{
					marginTop: "20px",
					padding: "10px",
					border: "1px solid #ccc",
					borderRadius: "8px",
					overflow: "hidden",
				}}
			>
				<AnimatePresence>
					<div>test</div>
					{items.map(item => (
						<motion.div
							key={item}
							layout
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							transition={{duration: 0.3}}
							style={{
								padding: "10px",
								marginBottom: "8px",
								background: "#f0f0f0",
								borderRadius: "4px",
							}}
						>
							Item {item}
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>
		</div>
	)
}

function CategoryFloatingSelect({
	value,
	onChange,
}: {
	value?: Id<"categories">[]
	onChange: (value: Id<"categories">[]) => void
}) {
	const {data: categories, isLoading} = useQuery(
		convexQuery(api.categories.getMine, {}),
	)
	const options = (categories ?? []).map(c => ({
		label: c.name,
		value: c._id,
	}))

	return (
		<FloatingSelect
			className="w-[250px]"
			options={options}
			value={value}
			onChange={onChange}
			placeholder={isLoading ? "Loading..." : "Select a category"}
		/>
	)
}

const TRANSITION = {
	type: "spring",
	bounce: 0.1,
	duration: 111.3,
} as const

type Option = {
	value: string
	label: string
}

type Props<TValue extends string> = {
	placeholder?: string
	options: Option[]
	value?: TValue[]
	className?: string
	onChange: (value: TValue[]) => void
}

function FloatingSelect<TValue extends string>({
	options,
	placeholder = "Select",
	value,
	onChange,
	className,
}: Props<TValue>) {
	const [isOpen, setIsOpen] = useState(false)

	const wrapRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const [flexDirection, setFlexDirection] = useState<
		"column" | "column-reverse"
	>("column")
	const [justifyContent, setJustifyContent] = useState<"end" | "start">("end")

	const floatingRefCallback = (ref: HTMLDivElement | null) => {
		if (!triggerRef.current || !ref) return
		computePosition(triggerRef.current, ref, {
			middleware: [flip()],
		}).then(o => {
			console.log(o)
			if (o.placement.includes("bottom")) {
				setFlexDirection("column")
				setJustifyContent("start")
			} else {
				setFlexDirection("column-reverse")
				setJustifyContent("end")
			}
			if (wrapRef.current) {
				console.log(wrapRef.current.clientHeight, ref.clientHeight)
				console.log(`${wrapRef.current.clientHeight - ref.clientHeight}px`)
				wrapRef.current.style.height = `${wrapRef.current.clientHeight - ref.clientHeight}px`
			}
		})
	}

	const selectedOptions = options.filter(option =>
		value?.includes(option.value as TValue),
	)

	const notSelectedOptions = options.filter(
		option => !value?.includes(option.value as TValue),
	)

	return (
		<div ref={wrapRef} className="flex flex-col" style={{justifyContent}}>
			<button
				type="button"
				ref={triggerRef}
				className="flex gap-2 w-full border-2 border-border p-2 squircle-2xl bg-background text-left"
				style={{flexDirection}}
				onClick={() => setIsOpen(v => !v)}
			>
				{selectedOptions.length > 0 ? (
					<SelectedOptions options={selectedOptions} />
				) : (
					<span className="ml-1.5 text-muted-foreground">{placeholder}</span>
				)}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							className="overflow-hidden"
							key="list"
							initial={{height: 0, opacity: 0}}
							animate={{height: "auto", opacity: 1}}
							exit={{height: 0, opacity: 0}}
							transition={{duration: 0.2, ease: "easeInOut"}}
						>
							<motion.div
								ref={floatingRefCallback}
								onClick={() => setIsOpen(v => !v)}
							>
								{notSelectedOptions.map(option => (
									<div
										className="p-2 squircle-2xl hover:bg-accent"
										key={option.value}
										onClick={() => onChange([...value, option.value as TValue])}
									>
										{option.label}
									</div>
								))}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</button>
		</div>
	)
}

function FloatingSelectCmdkFail() {
	const [isOpen, setIsOpen] = useState(false)

	const wrapRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const [flexDirection, setFlexDirection] = useState<
		"column" | "column-reverse"
	>("column")
	const [justifyContent, setJustifyContent] = useState<"end" | "start">("end")

	const floatingRefCallback = (ref: HTMLDivElement | null) => {
		if (!triggerRef.current || !ref) return
		computePosition(triggerRef.current, ref, {
			middleware: [flip()],
		}).then(o => {
			console.log(o)
			if (o.placement.includes("bottom")) {
				setFlexDirection("column")
				setJustifyContent("start")
			} else {
				setFlexDirection("column-reverse")
				setJustifyContent("end")
			}
			if (wrapRef.current) {
				console.log(wrapRef.current.clientHeight, ref.clientHeight)
				console.log(`${wrapRef.current.clientHeight - ref.clientHeight}px`)
				wrapRef.current.style.height = `${wrapRef.current.clientHeight - ref.clientHeight}px`
			}
		})
	}

	return (
		<div ref={wrapRef} className="flex flex-col" style={{justifyContent}}>
			<Command
				type="button"
				// layout
				// transition={{duration: 0.4, ease: "easeInOut"}}
				ref={triggerRef}
				// className="flex w-full  border-2 border-red-300 px-4 pt-2 pb-6 rounded-2xl bg-red-500/50 "
				style={{flexDirection}}
			>
				{/* <CommandList>
					<CommandGroup> */}
				{/* <CommandItem asChild  > */}
				<button type="button" onClick={() => setIsOpen(v => !v)}>
					CLICK MEE
				</button>
				{/* </CommandItem> */}
				{/* </CommandGroup>
				</CommandList> */}
				{/* <CommandInput placeholder="Search for a command" /> */}
				{/* <span>select ({isOpen ? "open" : "closed"})</span> */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							className="overflow-hidden"
							key="list"
							initial={{height: 0, opacity: 0}}
							animate={{height: "auto", opacity: 1}}
							exit={{height: 0, opacity: 0}}
							transition={{duration: 0.2, ease: "easeInOut"}}
						>
							<CommandList ref={floatingRefCallback}>
								<CommandGroup>
									<CommandItem>Calendar</CommandItem>
									<CommandItem>Search Emoji</CommandItem>
									<CommandItem>Calculator</CommandItem>
								</CommandGroup>
							</CommandList>
						</motion.div>
					)}
				</AnimatePresence>
			</Command>
		</div>
	)
}

function FloatingSelectWorking1() {
	const [isOpen, setIsOpen] = useState(false)

	const wrapRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLButtonElement>(null)

	const [flexDirection, setFlexDirection] = useState<
		"column" | "column-reverse"
	>("column")
	const [justifyContent, setJustifyContent] = useState<"end" | "start">("end")

	const floatingRefCallback = (ref: HTMLDivElement | null) => {
		if (!triggerRef.current || !ref) return
		computePosition(triggerRef.current, ref, {
			middleware: [flip()],
		}).then(o => {
			console.log(o)
			if (o.placement.includes("bottom")) {
				setFlexDirection("column")
				setJustifyContent("start")
			} else {
				setFlexDirection("column-reverse")
				setJustifyContent("end")
			}
			if (wrapRef.current) {
				console.log(wrapRef.current.clientHeight, ref.clientHeight)
				console.log(`${wrapRef.current.clientHeight - ref.clientHeight}px`)
				wrapRef.current.style.height = `${wrapRef.current.clientHeight - ref.clientHeight}px`
			}
		})
	}

	return (
		<div ref={wrapRef} className="flex flex-col" style={{justifyContent}}>
			<button
				type="button"
				// layout
				// transition={{duration: 0.4, ease: "easeInOut"}}
				ref={triggerRef}
				className="flex w-full  border-2 border-red-300 px-4 pt-2 pb-6 rounded-2xl bg-red-500/50 "
				style={{flexDirection}}
				onClick={() => setIsOpen(v => !v)}
			>
				<span>select ({isOpen ? "open" : "closed"})</span>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							className="overflow-hidden"
							key="list"
							initial={{height: 0, opacity: 0}}
							animate={{height: "auto", opacity: 1}}
							exit={{height: 0, opacity: 0}}
							transition={{duration: 0.2, ease: "easeInOut"}}
						>
							<motion.div
								ref={floatingRefCallback}
								onClick={() => setIsOpen(v => !v)}
							>
								options
								<div>1</div>
								<div>2</div>
								<div>3</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</button>
		</div>
	)
}

function FloatingSelectOld2() {
	const [isOpen, setIsOpen] = useState(false)

	const {refs, floatingStyles} = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		transform: false,
		middleware: [
			flip(),
			size({
				apply({rects, elements}) {
					Object.assign(elements.floating.style, {
						width: `${rects.reference.width}px`,
					})
				},
			}),
			// offset(({rects}) => {
			// 	return {
			// 		mainAxis: -rects.reference.height,
			// 	}
			// }),
		],
	})

	const id = useId()

	return (
		<MotionConfig transition={TRANSITION}>
			<div>{isOpen ? "open" : "closed"}</div>
			<motion.div layoutId={`content-${id}`} onClick={() => setIsOpen(v => !v)}>
				<div
					ref={refs.setReference}
					className="border-2 border-red-300 px-4 pt-2 pb-6 rounded-2xl bg-red-500/50"
				>
					select
				</div>
			</motion.div>
			{/* <AnimatePresence mode="popLayout"> */}
			{isOpen && (
				<motion.div
					// key="content"
					layoutId={`content-${id}`}
					className="border-2 border-green-300 p-6 pt-10 rounded-3xl bg-green-500/50"
					ref={refs.setFloating}
					style={floatingStyles}
					// transformTemplate={(transform, generated) => {
					// 	// console.log(transform, generated)
					// 	// return `${transform} ${generated}`
					// 	return generated
					// }}
					onClick={() => setIsOpen(v => !v)}
				>
					{/* <motion.div
							key="content"
							layoutId={`content-${id}`}
							className="border-2 border-green-300 p-6 pt-10 rounded-3xl bg-green-500/50"
						> */}
					options
					<div>1</div>
					<div>2</div>
					<div>3</div>
					{/* </motion.div> */}
				</motion.div>
			)}
			{/* </AnimatePresence> */}
		</MotionConfig>
	)
}

function FloatingSelectOld1() {
	const {refs, floatingStyles, elements, update} = useFloating({
		whileElementsMounted: autoUpdate,

		// placement: "bottom-start",
		// strategy: "fixed",
		// transform: false,
		middleware: [
			// offset(({rects, ...args}) => {
			// 	console.log("heeight", rects.floating.height)

			// 	return {
			// 		mainAxis: -rects.reference.height,
			// 		crossAxis: 10,
			// 		// mainAxis: 50,
			// 		// mainAxis: 0,
			// 		// crossAxis: 0,
			// 	}
			// }),
			flip(),
			// autoPlacement(),
			size({
				apply({rects, elements}) {
					console.log(rects.reference.width, rects.reference)
					elements.floating.style.setProperty(
						"--select-reference-width",
						`${rects.reference.width}px`,
					)
					// Object.assign(elements.floating.style, {
					// 	width: `${rects.reference.width}px`,
					// })
				},
			}),

			// flip({
			// 	fallbackStrategy: "initialPlacement",
			// }),
			// autoPlacement(),
		],
	})

	const [open, setOpen] = useState(false)

	const toggleFloating = () => {
		setOpen(v => !v)
	}

	const uniqueId = useId()
	return (
		<MotionConfig transition={TRANSITION}>
			<motion.div
				ref={refs.setReference}
				key={uniqueId}
				layoutId={`popover-${uniqueId}`}
				onClick={toggleFloating}
				className="border-2 border-red-300 p-2 rounded-2xl bg-background"
				// style={{borderRadius: "16px"}}
			>
				<motion.div layoutId={`test-${uniqueId}`} layout="position">
					test
				</motion.div>
			</motion.div>
			{/* <div ref={refs.setFloating} style={floatingStyles}> */}
			{/* <AnimatePresence> */}
			{open && (
				<>
					<div
						className="absolute"
						ref={refs.setFloating}
						style={floatingStyles}
						key={uniqueId}
					>
						<motion.div
							// ref={refs.setFloating}
							// style={floatingStyles}
							// layout
							key={uniqueId}
							layoutId={`popover-${uniqueId}`}
							role="dialog"
							aria-modal="true"
							className="z-10000 w-[var(--select-reference-width)] border-2 border-border p-4 rounded-2xl bg-background"
							onClick={toggleFloating}
							// initial="initial"
							// animate="animate"
							// style={{
							// 	borderRadius: "16px",
							// 	// ...floatingStyles,
							// }}
							// exit={{borderRadius: "24px"}}
						>
							<motion.div layoutId={`test-${uniqueId}`} layout="position">
								test
							</motion.div>
							{/* {nextOpen && ( */}
							<motion.div
							// initial={{opacity: 0}}
							// animate={{opacity: 1}}
							// exit={{opacity: 0}}
							// transition={{duration: 1}}
							>
								float float float float float float float float float float
								float float
							</motion.div>
							{/* )} */}
						</motion.div>
					</div>
				</>
			)}
			{/* </AnimatePresence> */}
			{/* </div> */}
		</MotionConfig>
	)
}

export function FancyCombobox() {
	const uniqueId = useId()
	const options = ["Twice", "Loona", "New Jeans", "IZ*ONE"]
	const [items, setItems] = useState<string[]>([])
	const [isOpen, setIsOpen] = useState(false)

	const closeMenu = () => {
		setItems([])
		setIsOpen(false)
	}

	return (
		<MorphingPopover
			transition={{
				type: "spring",
				bounce: 0.05,
				duration: 2,
			}}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<MorphingPopoverTrigger className="border-red-500 min-w-[250px] flex items-center border-2 text-foreground p-6 squircle-full">
				<motion.div layoutId={`popover-label-${uniqueId}`}>
					{items.length > 0 ? items.join(", ") : "Select an item"}
				</motion.div>
			</MorphingPopoverTrigger>
			<MorphingPopoverContent className="border-green-500 min-w-[250px] border-2 text-foreground p-6">
				<div className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-0">
					<div className="flex flex-col gap-6">
						<motion.div layoutId={`popover-label-${uniqueId}`}>
							{items.length > 0 ? items.join(", ") : "Select an item"}
						</motion.div>
						<div className="flex flex-col gap-2">
							<AnimatePresence>
								{options.map(option => (
									<motion.div key={option}>{option}</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</MorphingPopoverContent>
		</MorphingPopover>
	)
}

function CategoryCombobox({
	value,
	onChange,
}: {
	value?: Id<"categories">[]
	onChange: (value: Id<"categories">[]) => void
}) {
	const {data: categories, isLoading} = useQuery(
		convexQuery(api.categories.getMine, {}),
	)
	const options = (categories ?? []).map(c => ({
		label: c.name,
		value: c._id,
	}))

	return (
		<Combobox
			className="w-[250px]"
			options={options}
			value={value}
			onChange={onChange}
			placeholder={isLoading ? "Loading..." : "Select a category"}
		/>
	)
}
