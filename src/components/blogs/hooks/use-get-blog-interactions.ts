import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useBlogInteraction = (
  userId: Id<"users">,
  blogId: Id<"blogs">
) => {
  return useQuery(api.usersBlogsInteractions.getBlogInteraction, {
    userId,
    blogId,
  });
};
