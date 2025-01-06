"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Loader2Icon, LogOut } from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LogOutButton = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useNavigate();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    await signOut()
      .catch((error) => {
        toast.error("Failed to sign out. Please try again.");
        console.error("Sign out error:", error);
      })
      .then(() => {
        toast.success("Signed out successfully!");
        router("/auth");
      })
      .finally(() => {
        setIsSigningOut(false);
      });
  };

  // If not authenticated and not loading, show nothing
  if (!isAuthenticated && !isAuthLoading) {
    return (
      <Button size="lg" variant="outline" asChild type="button">
        <Link to="/auth">Register</Link>
      </Button>
    );
  }

  return (
    <button onClick={handleSignOut} disabled={isSigningOut || isAuthLoading}>
      {isSigningOut ? (
        <span className="flex flex-row items-center justify-center gap-2">
          <Loader2Icon className="h-4 w-4 animate-spin" />
          Signing out...
        </span>
      ) : (
        <span className="flex flex-row items-center justify-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </span>
      )}
    </button>
  );
};

export default LogOutButton;
