import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AuthSignInSchema,
  AuthSignInSchemaType,
  AuthSignUpSchema,
  AuthSignUpSchemaType,
} from "./auth-types";

export const AuthZodForm = () => {
  const signInZodForm = useForm<AuthSignInSchemaType>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpZodForm = useForm<AuthSignUpSchemaType>({
    resolver: zodResolver(AuthSignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  return { signInZodForm, signUpZodForm, AuthSignInSchema, AuthSignUpSchema };
};
