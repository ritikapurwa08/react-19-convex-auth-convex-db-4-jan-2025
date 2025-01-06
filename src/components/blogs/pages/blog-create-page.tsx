"use client";
import { Id } from "@convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  UseCreateBlogHook,
  useGenerateUploadUrl,
} from "../../../hooks/blogs/mutation/blog-interaction-hook";
import { Button } from "@/components/ui/button";
import CustomImageUrlInput from "@/components/form/email-validor-input";
import CustomTextarea from "@/components/form/custom-textarea";
import CustomInput from "@/components/form/custom-input";
import ImageUploadAndShowImage from "@/components/blogs/ui/blog-image-upload";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon } from "lucide-react";

type CreateBlogArgs = {
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

const BlogCreatePage = () => {
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

  const { mutate: createBlog, isPending: creatingBlog } = UseCreateBlogHook();

  const handleCreateBlog = async (formValues: CreateBlogFormType) => {
    try {
      const values: CreateBlogArgs = {
        title: formValues.title,
        content: formValues.content,
        localImageUrl: formValues.localImageUrl,
        convexStorageId: undefined,
        convexStorageUrl: undefined,
      };

      if (selectedImage) {
        setIsUploadingImage(true);

        // Step 1: Generate upload URL
        const url = await generateUploadUrl(
          {},
          {
            throwError: true,
          }
        );

        if (!url) throw new Error("URL not found.");

        // Step 2: Upload the image to Convex storage
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-type": selectedImage.type },
          body: selectedImage,
        });

        if (!result.ok) throw new Error("Failed to upload image.");

        // Step 3: Get the storageId from the response
        const { storageId } = await result.json();

        // Step 4: Assign storageId and URL to the values object
        values.convexStorageId = storageId;
        values.convexStorageUrl = url; // Use the generated URL or construct it if needed
        setIsUploadingImage(false);
      }

      // Step 5: Call createBlog mutation with the updated values
      await createBlog(
        {
          ...values,
        },
        {
          onSuccess() {
            toast({
              variant: "default",
              title: "Blog Created Successfully",
            });
          },
          onError(error) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error.message,
            });
            console.error("Error creating blog:", error.message);
          },
          onSettled() {
            form.reset();
            setSelectedImage(null);
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error during blog creation:", error);
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
      <h1 className="text-2xl  font-bold mb-6">Create a New Blog</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateBlog)}
          className="space-y-4"
        >
          {/* Image Upload Section */}
          <div className=" flex-row grid grid-cols-2">
            <ImageUploadAndShowImage
              image={selectedImage}
              setImage={setSelectedImage}
              imageRef={imageElementRef}
              onImageSelected={handleImageSelect}
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

          {/* Custom Image URL Input */}

          {/* Submit Button */}
          <Button
            disabled={creatingBlog || isUploadingImage}
            type="submit"
            className="w-full"
          >
            {creatingBlog || isUploadingImage ? (
              <span className="flex items-center gap-2">
                {isUploadingImage ? "Uploading Image..." : "Creating Blog..."}
                <span className="animate-spin">
                  <LoaderIcon className="size-3.5" />
                </span>
              </span>
            ) : (
              "Create Blog"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogCreatePage;
