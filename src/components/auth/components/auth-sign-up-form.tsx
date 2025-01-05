import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { AuthSignUpSchemaType } from "../constants/auth-types";
import { AuthZodForm } from "../constants/auh-zod-form";
import CustomInput from "@/components/form/custom-input";
import CustomPasswordInput from "@/components/form/custom-password-input";
import SubmitLoader from "@/components/loaders/submit-loader";
import CustomEmailInput from "@/components/form/custom-email-input";
import { Checkbox } from "@/components/ui/checkbox";

const SignUpInputs = () => {
  const { signIn } = useAuthActions();
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUpZodForm } = AuthZodForm();
  const [showPassword, setShowPassword] = useState(true);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (values: AuthSignUpSchemaType) => {
    setIsLoading(true);
    setError("");

    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await signIn("password", {
        email: values.email,
        name: values.name,
        password: values.password,
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
