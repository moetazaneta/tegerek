import {convexQuery} from "@convex-dev/react-query"
import {Label} from "@radix-ui/react-label"
import {useQuery} from "@tanstack/react-query"
import {Combobox} from "@/components/ui/combobox"
import {Switch} from "@/components/ui/switch"
import {api} from "@/convex/_generated/api"
import type {Id} from "@/convex/_generated/dataModel"

export type Filters = {
	categories?: Id<"categories">[]
	tags?: Id<"tags">[]
	income?: boolean
	expenses?: boolean
}

export function Filters({
	value,
	onChange,
}: {
	value: Filters
	onChange: (f: Filters) => void
}) {
	const {categories, tags} = value

	function toggleIncomeExpenses(filters: Filters) {
		const income = filters.income ?? true
		const expenses = filters.expenses ?? true
		if (income || expenses) {
			onChange(filters)
			return
		}

		const prevIncome = value.income ?? true
		const prevExpenses = value.expenses ?? true
		if (prevIncome) {
			onChange({...value, income: false, expenses: true})
			return
		}
		if (prevExpenses) {
			onChange({...value, income: true, expenses: false})
			return
		}
	}

	return (
		<div className="flex flex-col gap-4 w-[250px] shrink-0">
			<CategoryCombobox
				value={categories}
				onChange={categories => onChange({...value, categories})}
			/>
			<TagCombobox value={tags} onChange={tags => onChange({...value, tags})} />
			<SwitchRow
				label="Income"
				value={value.income ?? true}
				onChange={income => toggleIncomeExpenses({...value, income})}
			/>
			<SwitchRow
				label="Expenses"
				value={value.expenses ?? true}
				onChange={expenses => toggleIncomeExpenses({...value, expenses})}
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
	const {data: categories, isLoading} = useQuery(
		convexQuery(api.categories.getMine, {}),
	)
	const options = (categories ?? []).map(c => ({
		label: c.name,
		value: c._id,
	}))

	return (
		<Combobox
			className="w-full"
			loading={isLoading}
			loadingPlaceholder="Loading categories..."
			selectPlaceholder="Select categories"
			label="Categories"
			searchPlaceholder="Search categories"
			options={options}
			value={value}
			onChange={onChange}
		/>
	)
}

function TagCombobox({
	value,
	onChange,
}: {
	value?: Id<"tags">[]
	onChange: (value: Id<"tags">[]) => void
}) {
	const {data: categories, isLoading} = useQuery(
		convexQuery(api.tags.getMine, {}),
	)
	const options = (categories ?? []).map(c => ({
		label: c.name,
		value: c._id,
	}))

	return (
		<Combobox
			className="w-full"
			loading={isLoading}
			loadingPlaceholder="Loading tags..."
			selectPlaceholder="Select tags"
			label="Tags"
			searchPlaceholder="Search tags"
			options={options}
			value={value}
			onChange={onChange}
		/>
	)
}

function SwitchRow({
	label,
	value,
	onChange,
}: {
	label: string
	value: boolean
	onChange: (value: boolean) => void
}) {
	return (
		<Label className="flex flex-row items-center justify-between gap-2 w-full px-[4px]">
			{label}
			<Switch checked={value} onCheckedChange={onChange} />
		</Label>
	)
}
