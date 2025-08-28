/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accounts from "../accounts.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as http from "../http.js";
import type * as myFunctions from "../myFunctions.js";
import type * as statement from "../statement.js";
import type * as tags from "../tags.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";
import type * as utils_protected from "../utils/protected.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  auth: typeof auth;
  categories: typeof categories;
  http: typeof http;
  myFunctions: typeof myFunctions;
  statement: typeof statement;
  tags: typeof tags;
  transactions: typeof transactions;
  users: typeof users;
  "utils/protected": typeof utils_protected;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
