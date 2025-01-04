import React from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SubmitLoaderProps {
  loadingText: string;
  defaultText: string;
  loadingIcon?: IconType | LucideIcon;
  loadingState: boolean;
  disabled?: boolean; // Explicitly control disabled state
  className?: string;
  btnClassName?: string;
  onClick?: () => Promise<void>;
}

const SubmitLoader: React.FC<SubmitLoaderProps> = ({
  defaultText,
  loadingIcon: LoadingIcon,
  loadingState,
  disabled = false, // Default to false if not provided
  loadingText,
  className,
  btnClassName,
}) => {
  const isDisabled = disabled || loadingState; // Button is disabled if either disabled or loadingState is true

  return (
    <Button
      type="submit"
      className={twMerge(
        cn(
          "flex w-full items-center justify-center px-4 py-2 rounded font-semibold transition-colors disabled:cursor-not-allowed",
          isDisabled
            ? "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white" // Keep blue when loading but not clickable
            : "bg-blue-500 hover:bg-blue-600 text-white",
          className,
          btnClassName
        )
      )}
      disabled={isDisabled} // Use the combined isDisabled state
    >
      {loadingState ? (
        <>
          <span className="mr-2 animate-spin">
            {LoadingIcon && <LoadingIcon size={20} />}
          </span>
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </Button>
  );
};

export default SubmitLoader;
