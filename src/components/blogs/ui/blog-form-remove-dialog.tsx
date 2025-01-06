"use client";

import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UseRemoveBlogHook } from "../../../hooks/blogs/mutation/blog-interaction-hook";
import { Hint } from "@/components/ui/hint";

const BlogRemoveDialog = ({ blogId }: { blogId: Id<"blogs"> }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { mutate: removeBlog, isPending: isRemovingBlog } = UseRemoveBlogHook();

  const handleRemoveBlog = async () => {
    try {
      await removeBlog({ blogId });
      toast({
        variant: "default",
        title: "Blog Removed",
        description: (
          <div className="flex items-center gap-x-2">
            <CheckCircle2 className="text-green-500" size={20} />
            Blog removed successfully!
          </div>
        ),
        duration: 3000,
      });
      setOpen(false);
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        "An error occurred while removing the blog.";
      toast({
        variant: "destructive",
        title: "Error",
        description: (
          <div className="flex items-center gap-x-2">
            <AlertCircle className="text-red-500" size={20} />
            {errorMessage}
          </div>
        ),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Hint label="Remove Blog" side="top">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-fit px-5"
            disabled={isRemovingBlog}
          >
            <Trash2 className="size-5  " />
          </Button>
        </DialogTrigger>
      </Hint>
      <DialogContent className="sm:max-w-md bg-white shadow-lg rounded-lg">
        <DialogHeader className="py-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Remove Blog
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to remove this blog? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={isRemovingBlog}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleRemoveBlog}
            disabled={isRemovingBlog}
          >
            {isRemovingBlog && <Trash2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogRemoveDialog;
