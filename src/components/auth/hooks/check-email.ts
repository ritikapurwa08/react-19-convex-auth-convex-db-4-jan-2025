import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

interface CheckEmailProps {
  email: string;
}

export const useCheckEmail = ({ email }: CheckEmailProps) => {
  const checkEmail = useQuery(api.users.checkEmail, { email });

  const isLoading = checkEmail === undefined;
  return {
    checkEmail,
    isLoading,
  };
};
