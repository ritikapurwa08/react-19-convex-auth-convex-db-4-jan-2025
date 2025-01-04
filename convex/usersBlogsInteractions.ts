// convex/blogInteractions.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Like a blog
export const likeBlog = mutation({
  args: {
    userId: v.id("users"),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Check if the interaction already exists
    const existingInteraction = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user_blog", (q) =>
        q.eq("userId", userId).eq("blogId", blogId)
      )
      .unique();

    if (existingInteraction) {
      // If the user already liked the blog, do nothing
      if (existingInteraction.isLiked) return;

      // Update existing interaction
      await ctx.db.patch(existingInteraction._id, { isLiked: true });
    } else {
      // Create new interaction
      await ctx.db.insert("usersBlogsInteractions", {
        userId,
        blogId,
        isLiked: true,
        isSaved: false,
      });
    }

    // Update total likes in the blog
    const blog = await ctx.db.get(blogId);
    if (blog) {
      await ctx.db.patch(blogId, {
        totalLikes: (blog.totalLikes ?? 0) + 1,
      });
    }
  },
});

// Unlike a blog
export const unlikeBlog = mutation({
  args: {
    userId: v.id("users"),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Check if the interaction exists
    const existingInteraction = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user_blog", (q) =>
        q.eq("userId", userId).eq("blogId", blogId)
      )
      .unique();

    if (existingInteraction && existingInteraction.isLiked) {
      // Update existing interaction
      await ctx.db.patch(existingInteraction._id, { isLiked: false });

      // Update total likes in the blog
      const blog = await ctx.db.get(blogId);
      if (blog) {
        await ctx.db.patch(blogId, {
          totalLikes: Math.max(0, (blog.totalLikes ?? 0) - 1), // Ensure totalLikes doesn't go below 0
        });
      }
    }
  },
});

// Save a blog
export const saveBlog = mutation({
  args: {
    userId: v.id("users"),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Check if the interaction already exists
    const existingInteraction = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user_blog", (q) =>
        q.eq("userId", userId).eq("blogId", blogId)
      )
      .unique();

    if (existingInteraction) {
      // If the user already saved the blog, do nothing
      if (existingInteraction.isSaved) return;

      // Update existing interaction
      await ctx.db.patch(existingInteraction._id, { isSaved: true });
    } else {
      // Create new interaction
      await ctx.db.insert("usersBlogsInteractions", {
        userId,
        blogId,
        isLiked: false,
        isSaved: true,
      });
    }

    // Update total saves in the blog
    const blog = await ctx.db.get(blogId);
    if (blog) {
      await ctx.db.patch(blogId, {
        totalSaved: (blog.totalSaved ?? 0) + 1,
      });
    }
  },
});

// Unsave a blog
export const unsaveBlog = mutation({
  args: {
    userId: v.id("users"),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Check if the interaction exists
    const existingInteraction = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user_blog", (q) =>
        q.eq("userId", userId).eq("blogId", blogId)
      )
      .unique();

    if (existingInteraction && existingInteraction.isSaved) {
      // Update existing interaction
      await ctx.db.patch(existingInteraction._id, { isSaved: false });

      // Update total saves in the blog
      const blog = await ctx.db.get(blogId);
      if (blog) {
        await ctx.db.patch(blogId, {
          totalSaved: Math.max(0, (blog.totalSaved ?? 0) - 1), // Ensure totalSaved doesn't go below 0
        });
      }
    }
  },
});

export const getBlogInteraction = query({
  args: {
    userId: v.id("users"),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const interaction = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user_blog", (q) =>
        q.eq("userId", args.userId).eq("blogId", args.blogId)
      )
      .unique();

    return interaction || null; // Return the interaction or null if it doesn't exist
  },
});
export const getLikedBlogs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Fetch all interactions where the user has liked the blog
    const interactions = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter interactions where isLiked is true
    const likedInteractions = interactions.filter(
      (interaction) => interaction.isLiked
    );

    // Fetch blog details for each liked interaction
    const blogs = await Promise.all(
      likedInteractions.map((interaction) => ctx.db.get(interaction.blogId))
    );

    // Filter out null values (in case a blog was deleted)
    return blogs.filter((blog) => blog !== null);
  },
});

export const getSavedBlogs = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Fetch all interactions where the user has saved the blog
    const interactions = await ctx.db
      .query("usersBlogsInteractions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter interactions where isSaved is true
    const savedInteractions = interactions.filter(
      (interaction) => interaction.isSaved
    );

    // Fetch blog details for each saved interaction
    const blogs = await Promise.all(
      savedInteractions.map((interaction) => ctx.db.get(interaction.blogId))
    );

    // Filter out null values (in case a blog was deleted)
    return blogs.filter((blog) => blog !== null);
  },
});
