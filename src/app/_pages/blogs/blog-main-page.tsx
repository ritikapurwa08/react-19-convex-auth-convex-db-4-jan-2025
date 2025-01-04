"use client";

import { useState } from "react";
import BlogCard from "@/components/blogs/components/blog-card";
import BlogsLoadingCards from "@/components/blogs/components/blog-loading-cards";
// Use the paginated hook
import { Button } from "@/components/ui/button";
import { usePaginatedBlogs } from "@/components/blogs/hooks/blog-query-hooks";

interface BlogPageProps {
  showRemoveButton?: boolean;
  showUpdateButton?: boolean;
}

const BlogPage = ({ showRemoveButton, showUpdateButton }: BlogPageProps) => {
  const {
    results: blogs,
    status,
    loadMore,
    isLoading,
    hasMore,
  } = usePaginatedBlogs(5); // Load 5 blogs initially
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    loadMore(10);
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

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard
            showRemoveButton={showRemoveButton}
            showUpdateButton={showRemoveButton}
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
