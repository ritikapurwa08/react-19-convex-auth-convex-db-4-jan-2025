import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetCurrentProfile = () => {
  const currentProfile = useQuery(api.userProfiles.getCurrentUserProfile);

  return {
    currentProfile,
  };
};
