import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type MutationOptions<_TArgs, TResponse> = {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type MutationState<TResponse> = {
  data: TResponse | null;
  error: Error | null;
  status: "success" | "error" | "settled" | "pending" | null;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const useMutationHook = <TArgs extends {}, TResponse>(
  mutationFn: (args: TArgs) => Promise<TResponse>
) => {
  const [state, setState] = useState<MutationState<TResponse>>({
    data: null,
    error: null,
    status: null,
  });

  const isPending = useMemo(() => state.status === "pending", [state.status]);
  const isSuccess = useMemo(() => state.status === "success", [state.status]);
  const isError = useMemo(() => state.status === "error", [state.status]);
  const isSettled = useMemo(() => state.status === "settled", [state.status]);

  const mutate = useCallback(
    async (values: TArgs, options?: MutationOptions<TArgs, TResponse>) => {
      try {
        setState({ data: null, error: null, status: "pending" });

        const response = await mutationFn(values);
        setState({ data: response, error: null, status: "success" });
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setState({ data: null, error: error as Error, status: "error" });
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setState((prev) => ({ ...prev, status: "settled" }));
        options?.onSettled?.();
      }
    },
    [mutationFn]
  );

  return {
    mutate,
    isPending,
    isSuccess,
    isError,
    isSettled,
    error: state.error,
    data: state.data,
  };
};

export const UseCreateUserProfile = () => {
  const createUserProfileMutation = useMutation(
    api.userProfiles.upsertUserDetails
  );
  return useMutationHook(createUserProfileMutation);
};
export const UseUpdateUserProfile = () => {
  const updateUserProfileMutation = useMutation(
    api.userProfiles.updateUserDetails
  );
  return useMutationHook(updateUserProfileMutation);
};

const CreateUserZodSchema = z.object({
  extraUserDetais: z.object({
    addAdditionalName: z.string(),
    addAdditionalEmail: z.string(),
    address: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    customProfilePicture: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

export type CreateUserZodType = z.infer<typeof CreateUserZodSchema>;

export const UseCreateUserZodForm = () => {
  const form = useForm<CreateUserZodType>({
    resolver: zodResolver(CreateUserZodSchema),
    defaultValues: {
      extraUserDetais: {
        addAdditionalName: "",
        addAdditionalEmail: "",
        address: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        customProfilePicture: "",
        name: "",
        email: "",
      },
    },
  });

  return {
    form,
  };
};
