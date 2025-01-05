"use client";

import { useState } from "react";
import SignUpInputs from "./auth-sign-up-form";
import SignInInput from "./auth-sign-in-form";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div
      className="min-h-dvh bg-cover bg-center relative overflow-y-hidden"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1536336076412-fd2a4de236f0?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
      }}
    >
      {/* Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-2">
        <div className="bg-white/80 bg-opacity-90 rounded-lg shadow-xl max-w-md w-full mx-auto p-6 md:p-8 ">
          <div className="text-center prose prose-headings:m-0  dark:prose-invert mb-6">
            <h2 className="text-2xl text-pink-500/80 font-bold">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isSignUp ? "Create a new account" : "Log in to your account"}
            </p>
          </div>

          {isSignUp ? (
            <div className="space-y-4">
              <SignUpInputs />
            </div>
          ) : (
            <div className="space-y-4">
              <SignInInput />
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            </p>
            <button
              onClick={handleToggleForm}
              className="mt-1 text-blue-500 hover:text-blue-700 focus:outline-none focus:underline transition-colors duration-200"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
