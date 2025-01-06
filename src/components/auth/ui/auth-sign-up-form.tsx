import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { AuthSignUpSchemaType } from "../../../lib/types/auth/auth-types";
import { AuthZodForm } from "../../../lib/types/auth/auh-zod-form";
import CustomInput from "@/components/form/custom-input";
import CustomPasswordInput from "@/components/form/custom-password-input";
import SubmitLoader from "@/components/ui/submit-loader";
import CustomEmailInput from "@/components/form/custom-email-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Id } from "@convex/_generated/dataModel";

interface User {
  name: string;
  email: string;

  // Optional fields
  userName?: string;
  contactEmail?: string;
  role: "admin" | "proUser" | "user"; // Union of literal types
  age?: number;
  mobileNumber?: number;
  address?: string;
  customProfilePicture?: string;
  profileImageStorageId?: Id<"_storage">;

  // Following and Followers (arrays of user IDs)
  following: Id<"users">[];
  followers: Id<"users">[];

  // Security Questions (stored as a JSON string)
  securityQuestions: {
    answer: string;
    question: string;
  };

  // Timestamps
  updatedAt: number;
  lastPasswordUpdate?: number;

  // Arrays to store IDs of liked and saved blogs
  likedBlogs: Id<"blogs">[];
  savedBlogs: Id<"blogs">[];
}
const SignUpInputs = () => {
  const { signIn } = useAuthActions();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUpZodForm } = AuthZodForm();
  const [showPassword, setShowPassword] = useState(true);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (zodFormValues: AuthSignUpSchemaType) => {
    setIsLoading(true);
    setError("");

    // Check if passwords match
    if (zodFormValues.password !== zodFormValues.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const values: User = {
      email: zodFormValues.email,
      name: zodFormValues.name,
      followers: [],
      following: [],
      age: 0,
      likedBlogs: [],
      savedBlogs: [],
      role: "user",
      securityQuestions: { answer: "", question: "" },

      updatedAt: 0,
      address: "",
      contactEmail: "",
      customProfilePicture: "",
      lastPasswordUpdate: 0,
      mobileNumber: 0,
      profileImageStorageId: undefined,
      userName: "",
    };

    try {
      await signIn("password", {
        ...values,
        password: zodFormValues.password,
        flow: "signUp",
      });
      toast.success("Sign up Successful");
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...signUpZodForm}>
      <form
        className="flex flex-col gap-y-2"
        onSubmit={signUpZodForm.handleSubmit(handleSignUp)}
      >
        <CustomInput
          control={signUpZodForm.control}
          label="Name"
          disabled={loading}
          name="name"
          placeholder="Enter your name here"
        />

        <CustomEmailInput
          control={signUpZodForm.control}
          name="email"
          label="Email"
          placeholder="Enter your email"
        />

        <CustomPasswordInput
          control={signUpZodForm.control}
          label="Password"
          name="password"
          disabled={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          placeholder="Enter Your Password"
        />

        <CustomPasswordInput
          control={signUpZodForm.control}
          label="Confirm Password"
          name="confirmPassword"
          disabled={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          placeholder="Confirm Your Password"
        />

        <div className="flex flex-row items-center pt-2  gap-x-2">
          <Checkbox onClick={togglePassword} checked={showPassword} />
          <span className="text-sm">
            {showPassword ? "Hide" : "Show"} Password
          </span>
        </div>

        {!!error && (
          <div className="flex  h-8 rounded-lg flex-row bg-red-500/50 items-center justify-center px-4">
            <TriangleAlertIcon className="  size-3.5" />
            <p className="p-3 rounded-lg ">{error}</p>
          </div>
        )}

        <div className="w-full my-4">
          <SubmitLoader
            defaultText="Sign up"
            loadingIcon={LoaderIcon}
            loadingState={loading}
            loadingText="Signing up..."
          />
        </div>
      </form>
    </Form>
  );
};

export default SignUpInputs;
