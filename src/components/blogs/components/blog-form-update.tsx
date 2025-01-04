"use client";

import { useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { BlogZodValidation } from "../contants/blog-constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TbEdit } from "react-icons/tb";
import { AlertCircle, CheckCircle2, LoaderIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomInput from "@/components/form/custom-input";
import CustomTextarea from "@/components/form/custom-textarea";
import SubmitLoader from "@/components/loaders/submit-loader";
import { UseUpdateBlogHook } from "../hooks/blog-interaction-hook";
import { UseGetBlogByIdHook } from "../hooks/blog-query-hooks";
import { Hint } from "@/components/ui/hint";
import CustomImageUrlInput from "@/components/form/email-validor-input";

const BlogFormUpdateDialog = ({ blogId }: { blogId: Id<"blogs"> }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { mutate: updateBlog, isPending: updatingBlog } = UseUpdateBlogHook();
  const [errorMessage, setErrorMessage] = useState("");
  const { blog } = UseGetBlogByIdHook({ blogId });

  const { form: updateForm } = BlogZodValidation();

  useEffect(() => {
    if (blog) {
      updateForm.setValue("name", blog.name);
      updateForm.setValue("content", blog.content);
      updateForm.setValue("imageUrl", blog.imageUrl);
    }
  }, [blog, updateForm]);

  useEffect(() => {
    let errorTimer: NodeJS.Timeout;
    if (showErrorAlert) {
      errorTimer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000); // Hide alert after 5 seconds
    }

    return () => clearTimeout(errorTimer);
  }, [showErrorAlert]);

  const handleUpdateBlog = () => {
    updateBlog(
      {
        blogId,
        name: updateForm.getValues("name"),
        content: updateForm.getValues("content"),
        imageUrl: updateForm.getValues("imageUrl"),
      },
      {
        onSuccess: () => {
          toast({
            variant: "default",
            title: "Blog Updated",
            description: (
              <div className="flex items-center gap-x-2">
                <CheckCircle2 className="text-green-500" size={20} />
                Blog updated successfully!
              </div>
            ),
            duration: 3000,
          });
          setOpen(false);
        },
        onError: (error) => {
          setErrorMessage(
            error.message || "An error occurred while updating the blog."
          );
          setShowErrorAlert(true); // Show the error alert
          toast({
            variant: "destructive",
            title: "Error",
            description: (
              <div className="flex items-center gap-x-2">
                <AlertCircle className="text-red-500" size={20} />
                Something went wrong.
              </div>
            ),
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Hint side="bottom" label="update blog">
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" disabled={updatingBlog}>
            <TbEdit />
          </Button>
        </DialogTrigger>
      </Hint>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-lg rounded-lg p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Update Blog
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Make changes to your blog here. Click Update Blog when youre done.
          </DialogDescription>
        </DialogHeader>

        <Form {...updateForm}>
          <form
            onSubmit={updateForm.handleSubmit(handleUpdateBlog)}
            className="space-y-4"
          >
            {showErrorAlert && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">Error</AlertTitle>
                <AlertDescription className="text-gray-600">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
            <CustomInput
              control={updateForm.control}
              name="name"
              label="Name"
              placeholder="Enter blog name"
              defaultValue={blog?.name || ""}
              disabled={updatingBlog}
            />

            <CustomTextarea
              control={updateForm.control}
              name="content"
              label="Content"
              placeholder="Enter your content"
              disabled={updatingBlog}
            />
            <CustomImageUrlInput
              control={updateForm.control}
              name="imageUrl"
              label="Image URL"
              placeholder="Enter image URL"
              defaultValue={blog?.imageUrl || ""}
              disabled={updatingBlog}
            />

            <div className="pt-4 flex justify-end">
              <SubmitLoader
                defaultText="Update Blog"
                loadingIcon={LoaderIcon}
                loadingText="Updating..."
                loadingState={updatingBlog}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormUpdateDialog;
