import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";

type Blog = Doc<"blogs">;

interface UsePaginatedBlogsResult {
  results: Blog[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const usePaginatedBlogs = (
  queryName:
    | "getLatestBlogs"
    | "getPopularBlogs"
    | "getPaginatedBlogs"
    | "getUserLikedBlogs"
    | "getUserSavedBlogs"
    | "getUserCreatedBlogs",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.blogs[queryName],
    queryArgs, // Pass queryArgs to the query
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

export const useGetAllPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getPaginatedBlogs", {}, initialNumItems);
};

export const useGetLatestPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getLatestBlogs", {}, initialNumItems);
};

export const useGetPopularPaginatedBlogs = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getPopularBlogs", {}, initialNumItems);
};

export const useGetUserCreatedPaginatedBlogs = (
  userId: string | null,
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getUserCreatedBlogs", { userId }, initialNumItems);
};

export const useUserLikedPaginatedBlogs = (
  userId: string | null,
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getUserLikedBlogs", { userId }, initialNumItems);
};

export const useGetUserSavedPaginatedBlogs = (
  userId: string | null,
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedBlogs("getUserSavedBlogs", { userId }, initialNumItems);
};
