// convex/schema.ts
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const usersConvexSchema = defineTable({
  name: v.string(),
  email: v.string(),
  userName: v.optional(v.string()),
  contactEmail: v.optional(v.string()),
  role: v.union(v.literal("admin"), v.literal("proUser"), v.literal("user")),
  age: v.optional(v.number()),
  mobileNumber: v.optional(v.number()),
  address: v.optional(v.string()),
  customProfilePicture: v.optional(v.string()),
  profileImageStorageId: v.optional(v.id("_storage")),

  // Following and Followers (arrays of user IDs)
  following: v.array(v.id("users")),
  followers: v.array(v.id("users")),

  // Security Questions
  securityQuestions: v.array(
    v.object({
      question: v.string(),
      answer: v.string(), // Store a hashed version of the answer!
    })
  ),

  // Timestamps
  updatedAt: v.number(),
  lastPasswordUpdate: v.optional(v.number()),

  // Arrays to store IDs of liked and saved blogs
  likedBlogs: v.array(v.id("blogs")),
  savedBlogs: v.array(v.id("blogs")),
})
  .index("by_email", ["email"])
  .index("by_userName", ["userName"])
  .index("by_following", ["following"])
  .index("by_followers", ["followers"])
  .index("by_likedBlogs", ["likedBlogs"])
  .index("by_savedBlogs", ["savedBlogs"]);

const blogsConvexSchema = defineTable({
  title: v.string(),
  content: v.string(),
  authorId: v.id("users"),
  authorName: v.string(),
  authorProfileImage: v.optional(v.string()),
  convexStorageId: v.optional(v.id("_storage")),
  convexStorageUrl: v.optional(v.string()),
  localImageUrl: v.optional(v.string()),
  // Timestamps
  updatedAt: v.optional(v.number()),

  // Arrays to track likes and saves (arrays of user IDs)
  likedBy: v.optional(v.array(v.id("users"))),
  savedBy: v.optional(v.array(v.id("users"))),

  // Comments (array of comment objects)
  comments: v.optional(
    v.array(
      v.object({
        userId: v.id("users"),
        authorName: v.string(),
        authorProfileImage: v.optional(v.string()),
        comment: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
      })
    )
  ),
})
  .index("by_authorId", ["authorId"])
  .index("by_title", ["title"])
  .index("by_content", ["content"])
  .searchIndex("search_name_content", {
    searchField: "title",
    filterFields: ["content"],
  })
  .index("by_updatedAt", ["updatedAt"])
  .index("by_likedBy", ["likedBy"])
  .index("by_savedBy", ["savedBy"]);

const Schema = defineSchema({
  ...authTables,
  users: usersConvexSchema,
  blogs: blogsConvexSchema,
});

export default Schema;
