import {convexQuery} from "@convex-dev/react-query"
import {useQuery} from "@tanstack/react-query"
import {Combobox} from "@/components/ui/combobox"
import {api} from "@/convex/_generated/api"
import type {Id} from "@/convex/_generated/dataModel"

export type Filters = {
	categories?: Id<"categories">[]
}

export function Filters({
	value,
	onChange,
}: {
	value: Filters
	onChange: (f: Filters) => void
}) {
	const {categories} = value
	return (
		<div className="flex flex-col gap-2 w-[250px]">
			<CategoryCombobox
				value={categories}
				onChange={categories => onChange({...value, categories})}
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
			loading={isLoading}
			loadingPlaceholder="Loading categories..."
			selectPlaceholder="Select categories"
			label="Categories"
			searchPlaceholder="Search categories"
			className="w-[250px]"
			options={options}
			value={value}
			onChange={onChange}
		/>
	)
}
