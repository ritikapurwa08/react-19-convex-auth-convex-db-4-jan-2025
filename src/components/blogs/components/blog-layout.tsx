"use client";
import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router-dom";
import BlogSearchInput from "./blog-search-input";
import BlogFormCreate from "./blog-form-create";

const BlogLayout = () => {
  const location = useLocation();

  const isLikedPage = location.pathname.includes("liked");
  const isSavedPage = location.pathname.includes("saved");

  return (
    <main className="container mx-auto pb-10 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-y-0 py-8">
        {/* Title and Description */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {isLikedPage
              ? "Liked Blogs"
              : isSavedPage
                ? "Saved Blogs"
                : "Blogs"}
          </h1>
          <p className="text-gray-600 mt-2">
            Explore the latest blogs from our community.
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-row items-center gap-2 w-full md:w-auto">
          <BlogSearchInput />
          <BlogFormCreate />
        </div>
      </div>
      <div
        id="blog-list"
        className={cn("transition-all duration-300 ease-in-out")}
      >
        <Outlet />
      </div>
    </main>
  );
};

export default BlogLayout;
