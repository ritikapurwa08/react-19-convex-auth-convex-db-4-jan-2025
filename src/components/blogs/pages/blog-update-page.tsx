"use client";
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  UseUpdateBlogHook,
  useGenerateUploadUrl,
  UseRemoveBlogImage,
} from "../../../hooks/blogs/mutation/blog-interaction-hook";
import { Button } from "@/components/ui/button";
import CustomImageUrlInput from "@/components/form/email-validor-input";
import CustomTextarea from "@/components/form/custom-textarea";
import CustomInput from "@/components/form/custom-input";
import ImageUploadAndShowImage from "@/components/blogs/ui/blog-image-upload";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon } from "lucide-react";
import { UseGetBlogByIdHook } from "../../../hooks/blogs/query/blog-query-hooks";

type UpdateBlogArgs = {
  title: string;
  content: string;
  convexStorageId?: Id<"_storage">;
  convexStorageUrl?: string;
  localImageUrl?: string;
};

const CreateBlogZodSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  localImageUrl: z.string().optional(),
});

type CreateBlogFormType = z.infer<typeof CreateBlogZodSchema>;

const BlogUpdatePage = ({ blogId }: { blogId: Id<"blogs"> }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageElementRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<CreateBlogFormType>({
    resolver: zodResolver(CreateBlogZodSchema),
    defaultValues: {
      title: "",
      content: "",
      localImageUrl: "",
    },
  });

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: updateBlog, isPending: updatingBlog } = UseUpdateBlogHook();
  const { mutate: removeImage } = UseRemoveBlogImage();
  const { blog, isLoading } = UseGetBlogByIdHook({ blogId });

  // Use useEffect to reset the form when blog data is loaded
  useEffect(() => {
    if (blog && !isLoading) {
      form.reset({
        title: blog.title,
        content: blog.content,
        localImageUrl: blog.localImageUrl,
      });
    }
  }, [blog, isLoading, form]); // Dependencies: blog, isLoading, form

  const handleUpdateBlog = async (formValues: CreateBlogFormType) => {
    try {
      const values: UpdateBlogArgs = {
        title: formValues.title,
        content: formValues.content,
        localImageUrl: formValues.localImageUrl,
        convexStorageId: blog?.convexStorageId,
        convexStorageUrl: blog?.convexStorageUrl,
      };

      if (selectedImage) {
        setIsUploadingImage(true);

        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("URL not found.");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-type": selectedImage.type },
          body: selectedImage,
        });
        if (!result.ok) throw new Error("Failed to upload image.");

        const { storageId } = await result.json();

        if (blog?.convexStorageId) {
          await removeImage({
            blogId: blog._id,
            convexStorageId: blog.convexStorageId,
            convexStorageUrl: blog.convexStorageUrl!,
          });
        }

        values.convexStorageId = storageId;
        values.convexStorageUrl = url;
        setIsUploadingImage(false);
      }

      await updateBlog(
        {
          blogId,
          ...values,
        },
        {
          onSuccess() {
            toast({
              variant: "default",
              title: "Blog Updated Successfully",
            });
          },
          onError(error) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error.message,
            });
            console.error("Error updating blog:", error.message);
          },
          onSettled() {
            form.reset();
            setSelectedImage(null);
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error during blog update:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An unexpected error occurred. Please try again later.",
      });
      setIsUploadingImage(false);
    }
  };

  const handleImageSelect = (image: File | null) => {
    setSelectedImage(image);
  };

  return (
    <div className="container max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Update Blog</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateBlog)}
          className="space-y-4"
        >
          {/* Image Upload Section */}
          <div className="flex-row grid grid-cols-2">
            <ImageUploadAndShowImage
              image={selectedImage}
              setImage={setSelectedImage}
              imageRef={imageElementRef}
              onImageSelected={handleImageSelect}
              initialImageUrl={blog?.convexStorageUrl}
            />
            <div className="h-full flex items-end w-full min-w-full">
              <CustomImageUrlInput
                control={form.control}
                name="localImageUrl"
                label="Image URL"
                placeholder="Enter a Valid Image URL"
              />
            </div>
          </div>

          {/* Blog Name Input */}
          <div className="">
            <CustomInput
              control={form.control}
              name="title"
              label="Blog Name"
              placeholder="Enter Blog Name"
            />

            {/* Blog Content Textarea */}
            <CustomTextarea
              control={form.control}
              name="content"
              label="Blog Content"
              placeholder="Enter Blog Content"
            />
          </div>

          {/* Submit Button */}
          <Button
            disabled={updatingBlog || isUploadingImage}
            type="submit"
            className="w-full"
          >
            {updatingBlog || isUploadingImage ? (
              <span className="flex items-center gap-2">
                {isUploadingImage ? "Uploading Image..." : "Updating Blog..."}
                <span className="animate-spin">
                  <LoaderIcon className="size-3.5" />
                </span>
              </span>
            ) : (
              "Update Blog"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogUpdatePage;
