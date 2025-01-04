// convex/schema.ts
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const Schema = defineSchema({
  ...authTables,
  blogs: defineTable({
    name: v.string(), // Title of the blog
    content: v.string(), // Content of the blog
    authorId: v.id("users"), // ID of the user who created the blog
    authorName: v.string(), // Name of the author
    image: v.optional(v.id("_storage")), // Optional image stored in Convex storage
    imageUrl: v.optional(v.string()), // Optional URL of the image
    updatedAt: v.optional(v.number()), // Timestamp of the last update
    totalLikes: v.optional(v.number()),
    totalSaved: v.optional(v.number()),
  })
    .index("by_name", ["name"]) // Index for searching by name
    .index("by_content", ["content"]) // Index for searching by content
    .searchIndex("search_name_content", {
      searchField: "name", // Field to search
      filterFields: ["content"], // Additional fields to filter
    })

    .index("by_popular", ["totalLikes"]),

  userProfiles: defineTable({
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
      profilePicture: v.optional(v.id("_storage")),
      customProfilePicture: v.optional(v.string()),
      favorites: v.optional(v.array(v.id("products"))),
      cartItem: v.optional(v.array(v.id("products"))),
    }),
  }).index("by_user_id", ["existingUserId"]),

  usersBlogsInteractions: defineTable({
    userId: v.id("users"), // ID of the user interacting with the blog
    blogId: v.id("blogs"), // ID of the blog being interacted with
    isLiked: v.boolean(), // Whether the user has liked the blog
    isSaved: v.boolean(),

    // Whether the user has saved the blog
  })
    .index("by_user_blog", ["userId", "blogId"]) // Index for fast lookups by user and blog
    .index("by_user", ["userId"]) // Index for fast lookups by user
    .index("by_blog", ["blogId"]), // Index for fast lookups by blog
});

export default Schema;
