import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc, Id } from "@convex/_generated/dataModel";

type Users = Doc<"users">;

interface UsePaginatedBlogsResult {
  results: Users[];
  status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  isLoading: boolean;
  hasMore: boolean;
}

interface Prosps {
  userId: Id<"users">;
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

export const useGetUserTotalFollowing = ({ userId }: Prosps) => {
  const totalFollowing = useQuery(api.users.getFollowingCount, { userId });
  const isLoading = totalFollowing === undefined;

  return {
    totalFollowing,
    isLoading,
  };
};

export const useGetUserTotalFollowers = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const totalFollowers = useQuery(api.users.getFollowersCount, { userId });
  const isLoading = totalFollowers === undefined;

  return {
    totalFollowers,
    isLoading,
  };
};

export const useGetUserFollowingList = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const followingList = useQuery(api.users.getFollowingList, { userId });
  const isLoading = followingList === undefined;

  return {
    followingList,
    isLoading,
  };
};

export const useGetUserFollowersList = ({
  userId,
}: {
  userId: Id<"users">;
}) => {
  const followersList = useQuery(api.users.getFollowersList, { userId });
  const isLoading = followersList === undefined;

  return {
    followersList,
    isLoading,
  };
};

export const UseGetCurrentUserQueryHook = () => {
  const user = useQuery(api.users.getCurrentUser);
  const isLoading = user === undefined;
  const error = user === null;
  return {
    user,
    isLoading,
    error,
  };
};

export const GetUserByIdHook = ({ userId }: Prosps) => {
  const user = useQuery(api.users.getUserByID, { userId });
  const isLoading = user === undefined;

  return {
    user,
    isLoading,
  };
};

export const CheckIfFollowingHook = ({
  userIdToCheck,
}: {
  userIdToCheck: Id<"users">;
}) => {
  const checkIfFollow = useQuery(api.users.checkIfFollowing, {
    userIdToCheck: userIdToCheck,
  });
  return {
    checkIfFollow,
  };
};
