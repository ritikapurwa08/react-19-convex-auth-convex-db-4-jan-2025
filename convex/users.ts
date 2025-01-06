import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "../convex/_generated/server";
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

export const updateAuthorProfileImage = mutation({
  args: {
    authorProfileImage: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User Not Found updateauthorprofileImage");
    }
    const user = ctx.db.get(userId);

    const updateUserProfileImage = await ctx.db.patch(userId, {
      customProfilePicture: args.authorProfileImage,
    });

    return updateUserProfileImage;
  },
});

export const getFollowingList = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const followingUsers = await Promise.all(
      user.following.map(async (userId) => {
        return await ctx.db.get(userId);
      })
    );
    return followingUsers.filter((user) => user !== null); // Filter out any null values
  },
});

export const getFollowersList = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const followers = await Promise.all(
      user.followers.map(async (userId) => {
        return await ctx.db.get(userId);
      })
    );
    return followers.filter((user) => user !== null); // Filter out any null values
  },
});

export const getFollowingCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.following.length;
  },
});

export const getFollowersCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.followers.length;
  },
});

export const followUser = mutation({
  args: { userIdToFollow: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    if (currentUser._id === args.userIdToFollow) {
      throw new Error("Cannot follow yourself");
    }

    // Check if already following
    if (currentUser.following.includes(args.userIdToFollow)) {
      throw new Error("Already following this user");
    }

    // Check if the user to follow exists
    const userToFollow = await ctx.db.get(args.userIdToFollow);
    if (!userToFollow) {
      throw new Error("User to follow not found");
    }

    // Update current user's following list
    await ctx.db.patch(currentUser._id, {
      following: [...currentUser.following, args.userIdToFollow],
    });

    // Update followed user's followers list
    await ctx.db.patch(args.userIdToFollow, {
      followers: [...userToFollow.followers, currentUser._id],
    });

    return args.userIdToFollow;
  },
});

export const checkIfFollowing = query({
  args: { userIdToCheck: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Check if the current user is following the target user
    return currentUser.following.includes(args.userIdToCheck);
  },
});

export const unfollowUser = mutation({
  args: { userIdToUnfollow: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    if (currentUser._id === args.userIdToUnfollow) {
      throw new Error("Cannot unfollow yourself");
    }

    // Check if the current user is following the target user
    if (!currentUser.following.includes(args.userIdToUnfollow)) {
      throw new Error("Not following this user");
    }

    // Remove the target user from the current user's following list
    await ctx.db.patch(currentUser._id, {
      following: currentUser.following.filter(
        (id) => id !== args.userIdToUnfollow
      ),
    });

    // Remove the current user from the target user's followers list
    const userToUnfollow = await ctx.db.get(args.userIdToUnfollow);
    if (userToUnfollow) {
      await ctx.db.patch(args.userIdToUnfollow, {
        followers: userToUnfollow.followers.filter(
          (id) => id !== currentUser._id
        ),
      });
    }

    return args.userIdToUnfollow;
  },
});

export const getUserByID = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = args.userId;

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("user not found from users table get blog by id ");
    }

    return user;
  },
});
