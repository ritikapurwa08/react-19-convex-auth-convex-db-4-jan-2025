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
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPageProps {
  showRemoveButton?: boolean;
  showUpdateButton?: boolean;
}

const BlogPage = ({ showRemoveButton, showUpdateButton }: BlogPageProps) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "latest" | "popular"
  >("latest"); // Default to "latest"
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Add state for selected category

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
    loadMore(10); // Load 10 more items
    setLoadingMore(false);
  };

  // Dummy categories for now - replace with actual categories from your data
  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Fashion",
    "Lifestyle",
    "Health",
  ];

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
    <div className="container mx-auto pb-10 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className={cn(
              activeFilter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            )}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "latest" ? "default" : "outline"}
            onClick={() => setActiveFilter("latest")}
            className={cn(
              activeFilter === "latest"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            )}
          >
            Latest
          </Button>
          <Button
            variant={activeFilter === "popular" ? "default" : "outline"}
            onClick={() => setActiveFilter("popular")}
            className={cn(
              activeFilter === "popular"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            )}
          >
            Popular
          </Button>
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-auto">
          <Select
            value={selectedCategory || undefined}
            onValueChange={(value) => setSelectedCategory(value || null)}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-6 w-full sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
