import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

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
