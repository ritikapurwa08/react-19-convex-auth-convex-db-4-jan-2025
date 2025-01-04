import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const createBlog = mutation({
  args: {
    name: v.string(), // Changed from "name"
    content: v.string(),
    image: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }

    const user = await ctx.db.get(userId);

    if (!user?._id || !user.name) {
      throw new Error("User not authenticated");
    }

    const blog = await ctx.db.insert("blogs", {
      authorId: user._id,
      authorName: user.name,
      name: args.name, // Changed from "name"
      content: args.content,
      image: args.image,
      imageUrl: args.imageUrl,
    });

    return blog;
  },
});

export const updateBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    name: v.string(), // Changed from "name"
    content: v.string(),
    image: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const blogId = await ctx.db.get(args.blogId);

    if (!userId || !blogId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || !user) {
      return null;
    }

    // Check if the user is the author of the blog

    if (blog.authorId !== user._id) {
      throw new Error("Unauthorized to update this blog");
    }

    const updatedBlog = await ctx.db.patch(args.blogId, {
      name: args.name, // Changed from "name"
      content: args.content,
      image: args.image,
      imageUrl: args.imageUrl,
      updatedAt: Date.now(), // Store as numerical timestamp (string)
    });
    return updatedBlog;
  },
});

export const removeBlog = mutation({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const blogId = await ctx.db.get(args.blogId);

    if (!userId || !blogId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    const blog = await ctx.db.get(args.blogId);

    if (!blog || !user) {
      return null;
    }

    // Check if the user is the author of the blog

    if (blog.authorId !== user._id) {
      throw new Error("Unauthorized to update this blog");
    }

    if (blog.image) {
      await ctx.storage.delete(blog.image);
    }

    const removedBlog = await ctx.db.delete(args.blogId);

    return removedBlog;
  },
});

export const getBlogById = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    return blog;
  },
});

export const getAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = ctx.db.query("blogs").order("desc").collect();

    return blogs;
  },
});

export const searchBlogs = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const { searchTerm } = args;

    // Perform a case-insensitive search on the "name" and "content" fields
    return await ctx.db
      .query("blogs")
      .withSearchIndex("search_name_content", (q) =>
        q.search("name", searchTerm)
      )
      .collect(); // Fetch all matching results
  },
});

export const getPaginatedBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator, // Convex pagination options
  },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;
    const blogs = await ctx.db
      .query("blogs")
      .order("desc")
      .paginate(paginationOpts);
    return blogs;
  },
});

export const totalLikes = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      return 0;
    }

    if (blog.totalLikes === undefined) {
      return 0;
    }
    return blog.totalLikes;
  },
});
export const totalSaved = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.blogId);
    if (!blog) {
      return 0;
    }
    return blog.totalSaved || 0;
  },
});
