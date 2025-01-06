import { usePaginatedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";

type Users = Doc<"users">;

interface UsePaginatedBlogsResult {
  results: Users[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const usePaginatedUsers = (
  queryName: "getPaginatedUser",

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryArgs: Record<string, any> = {}, // Additional query arguments
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users[queryName],
    queryArgs, // Pass queryArgs to the query
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as Users[],
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};

export const UseGetAllPaginatedUsers = (
  initialNumItems: number = 5
): UsePaginatedBlogsResult => {
  return usePaginatedUsers("getPaginatedUser", {}, initialNumItems);
};

// export const useGetUserCreatedPaginatedBlogs = (
//   userId: string | null,
//   initialNumItems: number = 5
// ): UsePaginatedBlogsResult => {
//   return usePaginatedBlogs("getUserCreatedBlogs", { userId }, initialNumItems);
// };
