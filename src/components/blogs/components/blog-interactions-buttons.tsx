"use client";

import { useState } from "react";
import {
  useLikeBlog,
  useUnlikeBlog,
  useSaveBlog,
  useUnsaveBlog,
} from "../hooks/blog-interaction-hook";
import { Id } from "../../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Loader2,
  Bookmark,
  BookmarkCheck,
  LoaderIcon,
} from "lucide-react"; // Import icons from lucide-react
import { Hint } from "@/components/ui/hint";

interface InteractionProps {
  blogId: Id<"blogs">;
  userId: Id<"users">;
}

export const AddBlogLikeButton = ({ blogId, userId }: InteractionProps) => {
  const { mutate: addLike, isPending: addingLike } = useLikeBlog();
  const [error, setError] = useState("");

  const { toast } = useToast();

  const handleLike = async () => {
    try {
      await addLike({ blogId, userId });
      toast({
        variant: "default",
        title: "Blog Liked!",
        description: "You've successfully liked this blog.",
      });
    } catch (error) {
      setError(`Error: ${error}`);
      toast({
        variant: "destructive",
        title: "Failed to Like Blog",
        description:
          "An error occurred while liking the blog. Please try again.",
      });
    }
  };

  return (
    <div>
      <Hint label="like" side="top">
        <Button
          onClick={handleLike}
          disabled={addingLike}
          variant="outline"
          size="icon"
        >
          {addingLike ? (
            <LoaderIcon className="h-4 w-4 animate-spin" /> // Loading spinner
          ) : (
            <Heart className="h-4 w-4" /> // Heart icon
          )}
        </Button>
      </Hint>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export const RemoveBlogLikeButton = ({ blogId, userId }: InteractionProps) => {
  const { mutate: removeLike, isPending: removingLike } = useUnlikeBlog();
  const [error, setError] = useState("");

  const { toast } = useToast();

  const handleUnlike = async () => {
    try {
      await removeLike({ blogId, userId });
      toast({
        variant: "default",
        title: "Blog Unliked!",
        description: "You've successfully unliked this blog.",
      });
    } catch (error) {
      setError(`Error: ${error}`);
      toast({
        variant: "destructive",
        title: "Failed to Unlike Blog",
        description:
          "An error occurred while unliking the blog. Please try again.",
      });
    }
  };

  return (
    <div>
      <Hint label="dislike" side="top">
        <Button
          onClick={handleUnlike}
          disabled={removingLike}
          variant="outline"
          size="icon"
        >
          {removingLike ? (
            <LoaderIcon className="h-4 w-4  animate-spin" /> // Loading spinner
          ) : (
            <Heart className="size-8 fill-pink-600 outline-none" /> // Heart icon
          )}
        </Button>
      </Hint>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export const SaveBlogButton = ({ blogId, userId }: InteractionProps) => {
  const { mutate: saveBlog, isPending: savingBlog } = useSaveBlog();
  const [error, setError] = useState("");

  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveBlog({ blogId, userId });
      toast({
        variant: "default",
        title: "Blog Saved!",
        description: "You've successfully saved this blog.",
      });
    } catch (error) {
      setError(`Error: ${error}`);
      toast({
        variant: "destructive",
        title: "Failed to Save Blog",
        description:
          "An error occurred while saving the blog. Please try again.",
      });
    }
  };

  return (
    <div>
      <Hint label="Save" side="top">
        <Button
          onClick={handleSave}
          disabled={savingBlog}
          variant="outline"
          size="icon"
        >
          {savingBlog ? (
            <Loader2 className="h-4 w-4 animate-spin" /> // Loading spinner
          ) : (
            <Bookmark className="h-4 w-4" /> // Bookmark icon
          )}
        </Button>
      </Hint>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export const UnsaveBlogButton = ({ blogId, userId }: InteractionProps) => {
  const { mutate: unsaveBlog, isPending: unsavingBlog } = useUnsaveBlog();
  const [error, setError] = useState("");

  const { toast } = useToast();

  const handleUnsave = async () => {
    try {
      await unsaveBlog({ blogId, userId });
      toast({
        variant: "default",
        title: "Blog Unsaved!",
        description: "You've successfully unsaved this blog.",
      });
    } catch (error) {
      setError(`Error: ${error}`);
      toast({
        variant: "destructive",
        title: "Failed to Unsave Blog",
        description:
          "An error occurred while unsaving the blog. Please try again.",
      });
    }
  };

  return (
    <div>
      <Hint label="Unsave" side="top">
        <Button
          onClick={handleUnsave}
          disabled={unsavingBlog}
          variant="outline"
          size="icon"
        >
          {unsavingBlog ? (
            <Loader2 className="h-4 w-4 animate-spin" /> // Loading spinner
          ) : (
            <BookmarkCheck className="h-4 w-4 fill-blue-600" /> // Bookmark check icon
          )}
        </Button>
      </Hint>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};
