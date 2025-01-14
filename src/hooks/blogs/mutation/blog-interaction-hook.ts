import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";

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

export const useGenerateUploadUrl = () => {
  const generateUploadUrlMutation = useMutation(api.blogs.generateUploadUrl);
  return useMutationHook(generateUploadUrlMutation);
};

export const UseCreateBlogHook = () => {
  const createblogMutation = useMutation(api.blogs.createBlog);
  return useMutationHook(createblogMutation);
};
export const UseUpdateBlogHook = () => {
  const updateblogMutation = useMutation(api.blogs.updateBlog);
  return useMutationHook(updateblogMutation);
};
export const UseRemoveBlogImage = () => {
  const removeImagegMutation = useMutation(api.blogs.deleteImageData);
  return useMutationHook(removeImagegMutation);
};
export const UseRemoveBlogHook = () => {
  const removeblogMutation = useMutation(api.blogs.removeBlog);
  return useMutationHook(removeblogMutation);
};
export const AddToLikedBlogHook = () => {
  const addToLikeMutaion = useMutation(api.blogs.addToLiked);
  return useMutationHook(addToLikeMutaion);
};
export const RemoveToLikedBlogHook = () => {
  const removeblogLikedMutation = useMutation(api.blogs.removeFromLiked);
  return useMutationHook(removeblogLikedMutation);
};
export const AddToSavedBlogHook = () => {
  const addToSaveMutaion = useMutation(api.blogs.addToSaved);
  return useMutationHook(addToSaveMutaion);
};
export const RemoveToSavedBlogHook = () => {
  const removeblogSavedMutation = useMutation(api.blogs.removeFromSaved);
  return useMutationHook(removeblogSavedMutation);
};
