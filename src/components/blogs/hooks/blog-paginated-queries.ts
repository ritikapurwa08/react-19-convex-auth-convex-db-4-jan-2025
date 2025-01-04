import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

type Blog = Doc<"blogs">; // Define your Blog type

interface UsePaginatedBlogsResult {
  results: Blog[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const useGetAllPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getPaginatedBlogs,
    {},
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Blog[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export const useGetLatestPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getLatestBlogs,
    {},
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Blog[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export const useGetPopularPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs.getPopularBlogs, // Fixed: Use getPopularBlogs instead of getLatestBlogs
    {},
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Blog[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};
