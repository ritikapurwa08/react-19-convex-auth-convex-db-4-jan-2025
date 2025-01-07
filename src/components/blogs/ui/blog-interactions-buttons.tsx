import {
  AddToLikedBlogHook,
  AddToSavedBlogHook,
  RemoveToLikedBlogHook,
  RemoveToSavedBlogHook,
} from "../../../hooks/blogs/mutation/blog-interaction-hook";
import {
  GetTotalLikedOrSaved,
  IsLikedOrSavedHook,
} from "../../../hooks/blogs/query/blog-query-hooks";
import { Id } from "@convex/_generated/dataModel";
import { Hint } from "@/components/ui/hint";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Loader2 } from "lucide-react";

interface BlogInteractionButtonProps {
  userId: Id<"users">;
  blogId: Id<"blogs">;
}

export const BlogInteractionButton = ({
  blogId,
  userId,
}: BlogInteractionButtonProps) => {
  const { mutate: addToLike, isPending: addingToLiked } = AddToLikedBlogHook();
  const { mutate: removeToLike, isPending: removingToLike } =
    RemoveToLikedBlogHook();
  const { mutate: addToSaved, isPending: addingToSaved } = AddToSavedBlogHook();
  const { mutate: removeFromSaved, isPending: removingFromSaved } =
    RemoveToSavedBlogHook();

  const { isLiked, isSaved, chekingLiked, chekingSaved } = IsLikedOrSavedHook({
    blogId,
    userId,
  });
  const { totalLiked, totalSaved, loadingTotalSaved, loadingTotalLiked } =
    GetTotalLikedOrSaved({ blogId });

  const handleLikeClick = () => {
    if (isLiked) {
      removeToLike({ blogId, userId });
    } else {
      addToLike({ blogId, userId });
    }
  };

  const handleSaveClick = () => {
    if (isSaved) {
      removeFromSaved({ blogId, userId });
    } else {
      addToSaved({ blogId, userId });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Hint label={isLiked ? "Remove from liked" : "Add to liked"} side="top">
        <Button
          variant="outline"
          onClick={handleLikeClick}
          type="button"
          className="w-fit flex items-center justify-center"
          disabled={addingToLiked || removingToLike || chekingLiked}
        >
          {addingToLiked || removingToLike || chekingLiked ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={`size-5 ${isLiked ? "text-red-500 fill-red-500" : ""}`}
            />
          )}
          <span className="flex items-start justify-center text-sm ">
            {loadingTotalLiked ? "..." : totalLiked}
          </span>
        </Button>
      </Hint>

      <Hint label={isSaved ? "Remove from saved" : "Add to saved"} side="top">
        <Button
          variant="outline"
          className="w-fit"
          type="button"
          onClick={handleSaveClick}
          disabled={addingToSaved || removingFromSaved || chekingSaved}
        >
          {addingToSaved || removingFromSaved || chekingSaved ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark
              className={`size-5 ${isSaved ? "text-blue-500 fill-blue-500" : ""}`}
            />
          )}
          <span className="text-sm flex justify-center items-start ">
            {loadingTotalSaved ? "..." : totalSaved}
          </span>
        </Button>
      </Hint>
    </div>
  );
};
