// import { usePaginatedQuery, useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Doc, Id } from "@convex/_generated/dataModel";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

// type Blog = Doc<"blogs">; // Define your Blog type

// interface UsePaginatedBlogsResult {
//   results: Blog[];
//   status: "CanLoadMore" | "LoadingFirstPage" | "LoadingMore" | "Exhausted";
//   loadMore: (numItems: number) => void;
//   isLoading: boolean;
//   hasMore: boolean;
// }

interface GetBlogByIdHookProps {
  blogId: Id<"blogs">;
}

// export const UseGetAllBlogsHook = () => {
//   const blogs = useQuery(api.blogs.getAllBlogs);
//   return {
//     blogs,
//   };
// };

// export const usePaginatedBlogs = (
//   initialNumItems: number = 5
// ): UsePaginatedBlogsResult => {
//   const { results, status, loadMore } = usePaginatedQuery(
//     api.blogs.getPaginatedBlogs, // Corrected the query name
//     {},
//     { initialNumItems }
//   );

//   const isLoading = status === "LoadingFirstPage" || status === "LoadingMore";
//   const hasMore = status === "CanLoadMore";

//   return {
//     results: results as Blog[], // Cast to your Blog type
//     status,
//     loadMore,
//     isLoading,
//     hasMore,
//   };
// };

// export const useSavedBlogs = (userId: Id<"users">) => {
//   const savedBlogs = useQuery(api.usersBlogsInteractions.getSavedBlogs, {
//     userId,
//   });

//   const isLoading = savedBlogs === undefined;

//   return {
//     savedBlogs,
//     isLoading,
//   };
// };

// export const useLikedBlogs = (userId: Id<"users">) => {
//   const likedBlogs = useQuery(api.usersBlogsInteractions.getLikedBlogs, {
//     userId,
//   });

//   const isLoading = likedBlogs === undefined;
//   return {
//     likedBlogs,
//     isLoading,
//   };
// };

interface InteractionCheckProps {
  blogId: Id<"blogs">;
  userId: Id<"users">;
}

interface TotalCountProps {
  blogId: Id<"blogs">;
}

export const UseGetBlogByIdHook = ({ blogId }: GetBlogByIdHookProps) => {
  const blog = useQuery(api.blogs.getBlogById, { blogId });
  const isLoading = blog === undefined;
  return {
    blog,
    isLoading,
  };
};

export const IsLikedOrSavedHook = ({
  blogId,
  userId,
}: InteractionCheckProps) => {
  const isLiked = useQuery(api.blogs.isBlogLikedByUser, { blogId, userId });
  const chekingLiked = isLiked === undefined;
  const isSaved = useQuery(api.blogs.isBlogSavedByUser, { blogId, userId });
  const chekingSaved = isSaved === undefined;
  return {
    isLiked,
    chekingLiked,
    isSaved,
    chekingSaved,
  };
};

export const GetTotalLikedOrSaved = ({ blogId }: TotalCountProps) => {
  const totalLiked = useQuery(api.blogs.getTotalLikes, { blogId });
  const loadingTotalLiked = totalLiked === undefined;
  const totalSaved = useQuery(api.blogs.getTotalSaved, { blogId });
  const loadingTotalSaved = totalSaved === undefined;

  return {
    totalLiked,
    loadingTotalLiked,
    loadingTotalSaved,
    totalSaved,
  };
};
