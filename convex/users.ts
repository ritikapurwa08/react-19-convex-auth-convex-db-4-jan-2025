import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../convex/_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    return user;
  },
});

export const checkEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userEmailExist = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return userEmailExist !== null;
  },
});

export const getPaginatedUser = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;
    const users = await ctx.db
      .query("users")
      .order("asc")

      .paginate(paginationOpts);

    return users;
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    return user;
  },
});
