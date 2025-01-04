import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const UserProfileSchema = z.object({
  // Assuming IDs are strings
  userBio: z.string(),
  mobileNumber: z.string(),
  profileImage: z.string(), // Assuming you store storage IDs as strings
  givenProfileImage: z.string().optional(),
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

export const UseUserProfileZodForm = () => {
  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      userBio: "",
      mobileNumber: "",
      profileImage: "",
      givenProfileImage: "",
    },
  });

  return {
    form,
  };
};
