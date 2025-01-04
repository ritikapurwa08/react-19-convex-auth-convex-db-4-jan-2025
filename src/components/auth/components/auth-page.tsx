"use client";

import { useState } from "react"; // Make sure to have this component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpInputs from "./auth-sign-up-form";
import SignInInput from "./auth-sign-in-form";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-tr flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-4 md:mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {isSignUp ? "Create a new account" : "Log in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isSignUp ? (
            <>
              <div className="space-y-4">
                <SignUpInputs />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <SignInInput />
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            </p>
            <Button
              variant="link"
              onClick={handleToggleForm}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
