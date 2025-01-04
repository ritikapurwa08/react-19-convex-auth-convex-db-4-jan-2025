"use client";

import { ArrowLeft, Heart, Smile } from "lucide-react";
import { useCurrentUser } from "@/components/auth/hooks/get-current-user";
import BlogsLoadingCards from "@/components/blogs/components/blog-loading-cards";
import BlogCard from "@/components/blogs/components/blog-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSavedBlogs } from "@/components/blogs/hooks/blog-query-hooks";

const SavedBlogs = () => {
  const { user } = useCurrentUser();
  const userId = user?._id;

  // Call the hook unconditionally
  const { savedBlogs, isLoading: loadingSavedBlogs } = useSavedBlogs(userId!);

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
  if (loadingSavedBlogs) {
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
  if (!savedBlogs || savedBlogs.length === 0) {
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
    <main className="flex flex-col">
      <div className="pt-2">
        <Button asChild type="button" variant="outline">
          <Link className="flex flex-row" to="/blogs">
            <ArrowLeft className="" />
            Blogs
          </Link>
        </Button>
      </div>
      <div className=" w-full grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-3">
        {savedBlogs.map((savedBlogs) => (
          <BlogCard key={savedBlogs._id} {...savedBlogs} />
        ))}
      </div>
    </main>
  );
};

export default SavedBlogs;
