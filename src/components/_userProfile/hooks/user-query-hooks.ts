import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

type User = Doc<"users">;

interface UsePaginateUserResult {
  results: User[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}
export const usePaginatedUsers = (
  initialNumItems: number = 5
): UsePaginateUserResult => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.users.getPaginatedUser, // Corrected the query name
    {},
    { initialNumItems }
  );

  const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  return {
    results: results as User[], // Cast to your Blog type
    status,
    loadMore,
    isLoading,
    hasMore,
  };
};
