"use client";

import { useState } from "react";
import BlogCard from "@/components/blogs/components/blog-card";
import BlogsLoadingCards from "@/components/blogs/components/blog-loading-cards";
import { Button } from "@/components/ui/button";
import {
  useGetAllPaginatedBlogs,
  useGetLatestPaginatedBlogs,
  useGetPopularPaginatedBlogs,
} from "@/components/blogs/hooks/blog-paginated-queries";

interface BlogPageProps {
  showRemoveButton?: boolean;
  showUpdateButton?: boolean;
}

const BlogPage = ({ showRemoveButton, showUpdateButton }: BlogPageProps) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "latest" | "popular"
  >("all");

  // Use the appropriate hook based on the active filter
  const allBlogs = useGetAllPaginatedBlogs(5);
  const latestBlogs = useGetLatestPaginatedBlogs(5);
  const popularBlogs = useGetPopularPaginatedBlogs(5);

  const {
    results: blogs,
    status,
    loadMore,
    isLoading,
    hasMore,
  } = activeFilter === "all"
    ? allBlogs
    : activeFilter === "latest"
      ? latestBlogs
      : popularBlogs;

  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadMore(10); // Load 10 more items
    setLoadingMore(false);
  };

  // No blogs state
  if (!isLoading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">No Blogs Found</h1>
          <p className="text-gray-500 mt-2">
            It looks like there are no blogs to display. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
        <p className="text-gray-600 mt-2">
          Explore the latest blogs from our community.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
        >
          All Blogs
        </Button>
        <Button
          variant={activeFilter === "latest" ? "default" : "outline"}
          onClick={() => setActiveFilter("latest")}
        >
          Latest Blogs
        </Button>
        <Button
          variant={activeFilter === "popular" ? "default" : "outline"}
          onClick={() => setActiveFilter("popular")}
        >
          Popular Blogs
        </Button>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard
            showRemoveButton={showRemoveButton}
            showUpdateButton={showUpdateButton}
            key={blog._id}
            {...blog}
          />
        ))}
      </div>

      {/* Loading State (Initial Load) */}
      {isLoading && (
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <BlogsLoadingCards key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="px-8"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* No More Blogs State */}
      {!hasMore && status === "Exhausted" && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            That's all the blogs for now! Check back later for more.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
