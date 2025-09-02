import {convexQuery} from "@convex-dev/react-query"
import {useQuery} from "@tanstack/react-query"
import {Combobox} from "@/components/ui/combobox"
import {api} from "@/convex/_generated/api"
import type {Id} from "@/convex/_generated/dataModel"

export type Filters = {
	categories?: Id<"categories">[]
	tags?: Id<"tags">[]
}

export function Filters({
	value,
	onChange,
}: {
	value: Filters
	onChange: (f: Filters) => void
}) {
	const {categories, tags} = value
	return (
		<div className="flex flex-col gap-4 w-[250px] shrink-0">
			<CategoryCombobox
				value={categories}
				onChange={categories => onChange({...value, categories})}
			/>
			<TagCombobox value={tags} onChange={tags => onChange({...value, tags})} />
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
