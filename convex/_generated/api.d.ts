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
import type * as auth from "../auth.js";
import type * as blogs from "../blogs.js";
import type * as http from "../http.js";
import type * as userProfiles from "../userProfiles.js";
import type * as users from "../users.js";
import type * as usersBlogsInteractions from "../usersBlogsInteractions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blogs: typeof blogs;
  http: typeof http;
  userProfiles: typeof userProfiles;
  users: typeof users;
  usersBlogsInteractions: typeof usersBlogsInteractions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
