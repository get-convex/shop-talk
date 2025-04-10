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
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as janitor from "../janitor.js";
import type * as rtviConfig from "../rtviConfig.js";
import type * as shoppingListItems_mutations from "../shoppingListItems/mutations.js";
import type * as shoppingListItems_queries from "../shoppingListItems/queries.js";
import type * as shoppingLists_mutations from "../shoppingLists/mutations.js";
import type * as shoppingLists_queries from "../shoppingLists/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  http: typeof http;
  janitor: typeof janitor;
  rtviConfig: typeof rtviConfig;
  "shoppingListItems/mutations": typeof shoppingListItems_mutations;
  "shoppingListItems/queries": typeof shoppingListItems_queries;
  "shoppingLists/mutations": typeof shoppingLists_mutations;
  "shoppingLists/queries": typeof shoppingLists_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
