import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const createBlog = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    convexStorageId: v.optional(v.id("_storage")),
    convexStorageUrl: v.optional(v.string()),
    localImageUrl: v.optional(v.string()),

    // Arrays to track likes and saves (arrays of user IDs)

    // Comments (array of comment objects)
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("create Blog use Not Found");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("user not found create Blogs");
    }

    const blog = await ctx.db.insert("blogs", {
      authorId: user._id,
      authorName: user.name,
      title: args.title,
      content: args.content,
      convexStorageId: args.convexStorageId,
      convexStorageUrl: args.convexStorageUrl,
      localImageUrl: args.localImageUrl,
    });

    return blog;
  },
});

export const updateBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    title: v.string(),
    content: v.string(),
    convexStorageId: v.optional(v.id("_storage")),
    convexStorageUrl: v.optional(v.string()),
    localImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updatedAtTime = Date.now();

    const updatedBlog = await ctx.db.patch(args.blogId, {
      title: args.title,
      content: args.content,
      convexStorageId: args.convexStorageId,
      convexStorageUrl: args.convexStorageUrl,
      localImageUrl: args.localImageUrl,
      updatedAt: updatedAtTime,
    });

    return updatedBlog;
  },
});

export const getBlogById = query({
  args: {
    blogId: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    if (!args.blogId) {
      throw new Error("blog id not found get blog by Id ");
    }

    const blog = ctx.db.get(args.blogId);

    return blog;
  },
});

export const deleteImageData = mutation({
  args: {
    blogId: v.id("blogs"), // ID of the blog document
    convexStorageId: v.id("_storage"), // Storage ID of the image to delete
    convexStorageUrl: v.string(), // Storage URL of the image to delete
  },
  handler: async (ctx, args) => {
    // Fetch the blog document
    const blog = await ctx.db.get(args.blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Delete the image from Convex storage
    await ctx.storage.delete(args.convexStorageId);

    // Update the blog document to remove the image references
    await ctx.db.patch(args.blogId, {
      convexStorageId: undefined, // Set convexStorageId to undefined
      convexStorageUrl: undefined, // Set convexStorageUrl to undefined
    });

    return { success: true }; // Indicate that the deletion was successful
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
      throw new Error("remove blogs user or blog not found ");
    }

    // Check if the user is the author of the blog

    if (blog.authorId !== user._id) {
      throw new Error("Unauthorized to update this blog");
    }

    if (blog.convexStorageId) {
      await ctx.storage.delete(blog.convexStorageId);
    }

    const removedBlog = await ctx.db.delete(args.blogId);

    return removedBlog;
  },
});

export const getPaginatedBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .order("desc")
      .paginate(args.paginationOpts);

    return blogs;
  },
});

export const getLatestBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_creation_time")
      .order("desc")
      .paginate(args.paginationOpts);

    return blogs;
  },
});

export const getPopularBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_likedBy")
      .order("desc")
      .paginate(args.paginationOpts);

    return blogs;
  },
});

export const getUserLikedBlogs = query({
  args: {
    userId: v.id("users"), // The ID of the user whose liked blogs we want to fetch
    paginationOpts: paginationOptsValidator, // Pagination options
  },
  handler: async (ctx, args) => {
    // Fetch all blogs (paginated)
    const allBlogs = await ctx.db
      .query("blogs")
      .order("desc") // Optional: Order by creation time or another field
      .paginate(args.paginationOpts);

    // Filter blogs where the userId is in the likedBy array
    const likedBlogs = allBlogs.page.filter((blog) =>
      blog.likedBy?.includes(args.userId)
    );

    return {
      ...allBlogs,
      page: likedBlogs, // Replace the page with filtered results
    };
  },
});

export const getUserSavedBlogs = query({
  args: {
    userId: v.id("users"), // The ID of the user whose saved blogs we want to fetch
    paginationOpts: paginationOptsValidator, // Pagination options
  },
  handler: async (ctx, args) => {
    // Fetch all blogs (paginated)
    const allBlogs = await ctx.db
      .query("blogs")
      .order("desc") // Optional: Order by creation time or another field
      .paginate(args.paginationOpts);

    // Filter blogs where the userId is in the savedBy array
    const savedBlogs = allBlogs.page.filter((blog) =>
      blog.savedBy?.includes(args.userId)
    );

    return {
      ...allBlogs,
      page: savedBlogs, // Replace the page with filtered results
    };
  },
});

export const getUserCreatedBlogs = query({
  args: {
    userId: v.id("users"), // The ID of the user whose created blogs we want to fetch
    paginationOpts: paginationOptsValidator, // Pagination options
  },
  handler: async (ctx, args) => {
    // Fetch paginated blogs where the authorId matches the provided userId
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.userId)) // Use `eq` for single-value fields
      .order("desc") // Optional: Order by creation time or another field
      .paginate(args.paginationOpts);

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
        q.search("title", searchTerm)
      )
      .collect(); // Fetch all matching results
  },
});

export const addToLiked = mutation({
  args: {
    userId: v.id("users"), // The ID of the user who is liking the blog
    blogId: v.id("blogs"), // The ID of the blog being liked
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Fetch the user and blog documents
    const user = await ctx.db.get(userId);
    const blog = await ctx.db.get(blogId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check if the blog is already liked by the user
    if (user.likedBlogs.includes(blogId)) {
      throw new Error("Blog already liked by the user");
    }

    // Update the user's likedBlogs array
    await ctx.db.patch(userId, {
      likedBlogs: [...user.likedBlogs, blogId],
    });

    // Update the blog's likedBy array
    await ctx.db.patch(blogId, {
      likedBy: [...(blog.likedBy || []), userId],
    });

    return { success: true };
  },
});

export const removeFromLiked = mutation({
  args: {
    userId: v.id("users"), // The ID of the user who is unliking the blog
    blogId: v.id("blogs"), // The ID of the blog being unliked
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Fetch the user and blog documents
    const user = await ctx.db.get(userId);
    const blog = await ctx.db.get(blogId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check if the blog is already liked by the user
    if (!user.likedBlogs.includes(blogId)) {
      throw new Error("Blog not liked by the user");
    }

    // Update the user's likedBlogs array
    await ctx.db.patch(userId, {
      likedBlogs: user.likedBlogs.filter((id) => id !== blogId),
    });

    // Update the blog's likedBy array
    await ctx.db.patch(blogId, {
      likedBy: (blog.likedBy || []).filter((id) => id !== userId),
    });

    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addToSaved = mutation({
  args: {
    userId: v.id("users"), // The ID of the user who is saving the blog
    blogId: v.id("blogs"), // The ID of the blog being saved
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Fetch the user and blog documents
    const user = await ctx.db.get(userId);
    const blog = await ctx.db.get(blogId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check if the blog is already saved by the user
    if (user.savedBlogs.includes(blogId)) {
      throw new Error("Blog already saved by the user");
    }

    // Update the user's savedBlogs array
    await ctx.db.patch(userId, {
      savedBlogs: [...user.savedBlogs, blogId],
    });

    // Update the blog's savedBy array
    await ctx.db.patch(blogId, {
      savedBy: [...(blog.savedBy || []), userId],
    });

    return { success: true };
  },
});

export const removeFromSaved = mutation({
  args: {
    userId: v.id("users"), // The ID of the user who is unsaving the blog
    blogId: v.id("blogs"), // The ID of the blog being unsaved
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Fetch the user and blog documents
    const user = await ctx.db.get(userId);
    const blog = await ctx.db.get(blogId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Check if the blog is already saved by the user
    if (!user.savedBlogs.includes(blogId)) {
      throw new Error("Blog not saved by the user");
    }

    // Update the user's savedBlogs array
    await ctx.db.patch(userId, {
      savedBlogs: user.savedBlogs.filter((id) => id !== blogId),
    });

    // Update the blog's savedBy array
    await ctx.db.patch(blogId, {
      savedBy: (blog.savedBy || []).filter((id) => id !== userId),
    });

    return { success: true };
  },
});

export const isBlogLikedByUser = query({
  args: {
    userId: v.id("users"), // The ID of the user
    blogId: v.id("blogs"), // The ID of the blog
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Fetch the user document
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the blog is in the user's likedBlogs array
    return user.likedBlogs.includes(blogId);
  },
});

export const isBlogSavedByUser = query({
  args: {
    userId: v.id("users"), // The ID of the user
    blogId: v.id("blogs"), // The ID of the blog
  },
  handler: async (ctx, args) => {
    const { userId, blogId } = args;

    // Fetch the user document
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the blog is in the user's savedBlogs array
    return user.savedBlogs.includes(blogId);
  },
});

export const getTotalLikes = query({
  args: {
    blogId: v.id("blogs"), // The ID of the blog to fetch likes for
  },
  handler: async (ctx, args) => {
    const { blogId } = args;

    // Fetch the blog document
    const blog = await ctx.db.get(blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Return the total number of likes
    return blog.likedBy?.length || 0;
  },
});
export const getTotalSaved = query({
  args: {
    blogId: v.id("blogs"), // The ID of the blog to fetch likes for
  },
  handler: async (ctx, args) => {
    const { blogId } = args;

    // Fetch the blog document
    const blog = await ctx.db.get(blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Return the total number of likes
    return blog.savedBy?.length || 0;
  },
});

export const getFileUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
