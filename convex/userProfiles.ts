import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const upsertUserDetails = mutation({
  args: {
    existingUserId: v.optional(v.id("users")),
    extraUserDetais: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      addAdditionalName: v.optional(v.string()),
      addAdditionalEmail: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      address: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      customProfilePicture: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }
    const existingDetails = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("existingUserId"), userId))
      .unique();

    if (existingDetails) {
      await ctx.db.patch(existingDetails._id, {
        ...args.extraUserDetais,
        existingUserId: args.existingUserId,
      });
    } else {
      const userDetails = await ctx.db.insert("userProfiles", {
        ...args,
      });
      return userDetails;
    }
  },
});

export const getUserDetailsById = mutation({
  args: {
    userDetailsId: v.id("userProfiles"),
  },
  handler: async (ctx, args) => {
    const userDetails = await ctx.db.get(args.userDetailsId);
    if (!userDetails) {
      throw new Error("User details not found");
    }
    return userDetails;
  },
});

export const updateUserDetails = mutation({
  args: {
    userDetailsId: v.id("userProfiles"),
    extraUserDetails: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      addAdditionalName: v.optional(v.string()),
      addAdditionalEmail: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      address: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      customProfilePicture: v.optional(v.string()), // Consider removing if you're using profilePicture
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }

    const existingUserDetails = await ctx.db.get(args.userDetailsId);
    if (!existingUserDetails) {
      throw new Error("User details not found");
    }

    // Authorization check: Ensure the user owns these details
    if (existingUserDetails.existingUserId !== userId) {
      throw new Error("Unauthorized: You can only update your own details.");
    }

    // Merge the existing extraUserDetails with the new ones
    const updatedExtraUserDetails = {
      ...existingUserDetails.extraUserDetais, // Note: Still using extraUserDetais from your schema
      ...args.extraUserDetails,
    };

    // Update the user details
    await ctx.db.patch(args.userDetailsId, {
      existingUserId: userId,
      extraUserDetais: updatedExtraUserDetails, // Using extraUserDetais to match your schema
    });

    // Return the updated details

    return args.userDetailsId;
  },
});

export const getUserProfiles = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("existingUserId"), userId))
      .unique();

    if (!userProfile) {
      return null;
    }

    return userProfile;
  },
});
