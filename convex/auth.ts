import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel, Id } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,

      // Include other fields for user creation based on your usersConvexSchema:
      userName: params.userName as string | undefined,
      contactEmail: params.contactEmail as string | undefined,
      role: params.role as "admin" | "user" | "proUser",
      age: params.age as number | undefined,
      mobileNumber: params.mobileNumber as number | undefined,
      address: params.address as string | undefined,
      customProfilePicture: params.customProfilePicture as string | undefined,
      profileImageStorageId: params.profileImageStorageId as
        | Id<"_storage">
        | undefined, // Assuming it's a string here
      following: [], // Initialize as empty arrays
      followers: [],
      securityQuestions: [], // Initialize as empty
      updatedAt: params.updatedAt as number,
      lastPasswordUpdate: undefined,
      likedBlogs: [],
      savedBlogs: [],
    };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [CustomPassword],
});
