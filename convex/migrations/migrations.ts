import {Migrations} from "@convex-dev/migrations"
import {components} from "../_generated/api"
import type {DataModel} from "../_generated/dataModel"

export const migrations = new Migrations<DataModel>(components.migrations, {
	migrationsLocationPrefix: "migrations:",
})
export const run = migrations.runner()
