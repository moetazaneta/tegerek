"use client"

import {CheckIcon, XIcon} from "lucide-react"
import {AnimatePresence, motion} from "motion/react"
import * as React from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"

export type ComboboxOption = {value: string; label: string}

export function Combobox<TValue extends string>({
	value,
	onChange: setValue,
	options,
	placeholder = "Search option...",
	className,
}: {
	value?: TValue[] | null
	onChange: (value: TValue[]) => void
	options: ComboboxOption[]
	placeholder?: string
	className?: string
}) {
	const [open, setOpen] = React.useState(false)

	const selectedOptions = useSelectedOptions(options, value ?? [])

	const uniqueId = React.useId()

	return (
		<Popover
			open={open}
			onOpenChange={e => {
				setOpen(e)
			}}
		>
			<PopoverTrigger asChild>
				{/** biome-ignore lint/a11y/useSemanticElements: nah */}
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-[200px] justify-between hover:bg-transparent min-h-11.5",
						className,
					)}
				>
					{selectedOptions.length > 0 ? (
						<SelectedOptions options={selectedOptions} />
					) : (
						<span className="ml-1.5 text-muted-foreground">{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="max-h-[var(--radix-popover-content-available-height)] w-full min-w-[var(--radix-popover-trigger-width)] p-0">
				<Command>
					<CommandInput placeholder={placeholder} />
					<CommandList>
						<CommandEmpty>No option found.</CommandEmpty>
						<CommandGroup>
							{options.map(option => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={currentValue => {
										setValue(
											value?.includes(currentValue as TValue)
												? value.filter(v => v !== currentValue)
												: [...(value ?? []), currentValue as TValue],
										)
									}}
								>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											value?.includes(option.value as TValue)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function useSelectedOptions<TValue extends string>(
	options: ComboboxOption[],
	value: TValue[],
) {
	return options.filter(option => value.includes(option.value as TValue))
}

export function SelectedOptions({
	options,
	className,
}: {
	options: ComboboxOption[]
	className?: string
}) {
	return (
		<motion.div className={cn("flex flex-wrap gap-1", className)}>
			<AnimatePresence mode="popLayout">
				{options.map(option => (
					<Badge
						key={option.value}
						variant="secondary"
						className="relative group"
						asChild
					>
						<motion.div
							layout
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							transition={{
								duration: 0.2,
							}}
						>
							{option.label}
							<XIcon
								strokeWidth={3}
								className="absolute size-5 p-1 right-0 bg-gradient-to-l from-secondary to-transparent from-70% opacity-0 group-hover:opacity-100 transition-opacity"
							/>
						</motion.div>
					</Badge>
				))}
			</AnimatePresence>
		</motion.div>
	)
}
