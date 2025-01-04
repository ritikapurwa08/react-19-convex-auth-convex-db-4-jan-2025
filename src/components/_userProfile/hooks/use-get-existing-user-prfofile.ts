import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const UseGetUserProfiles = () => {
  const data = useQuery(api.userProfiles.getUserProfiles);
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
