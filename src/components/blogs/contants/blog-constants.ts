import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const blogZodSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().url("Invalid Url Formats").optional(),
});

export type BlogSchemaZodType = z.infer<typeof blogZodSchema>;

export const BlogZodValidation = () => {
  const form = useForm<BlogSchemaZodType>({
    resolver: zodResolver(blogZodSchema),
    defaultValues: {
      name: "",
      content: "",
      imageUrl: "",
    },
  });

  return {
    form,
  };
};
