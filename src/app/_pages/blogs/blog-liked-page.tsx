"use client";

import { useCurrentUser } from "@/components/auth/hooks/get-current-user";
import BlogCard from "@/components/blogs/components/blog-card";
import BlogsLoadingCards from "@/components/blogs/components/blog-loading-cards";
import { useLikedBlogs } from "@/components/blogs/hooks/blog-query-hooks";
import { Heart, Smile } from "lucide-react";

const LikedBlogs = () => {
  const { user } = useCurrentUser();
  const userId = user?._id;

  // Call the hook unconditionally
  const { isLoading: LoadingLikedBlogs, likedBlogs } = useLikedBlogs(userId!);

  // If user is not logged in
  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Please Log In
          </h1>
          <p className="text-gray-500 mt-2">
            Log in to view your favorite blogs.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (LoadingLikedBlogs) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <BlogsLoadingCards key={index} />
          ))}
        </div>
      </div>
    );
  }

  // No liked blogs state
  if (!likedBlogs || likedBlogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Smile className="h-12 w-12 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            No Liked Blogs Found
          </h1>
          <p className="text-gray-500 mt-2">
            You havent liked any blogs yet. Start exploring!
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className=" w-full grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-3">
      {likedBlogs.map((likedBlog) => (
        <BlogCard key={likedBlog._id} {...likedBlog} />
      ))}
    </main>
  );
};

export default LikedBlogs;
