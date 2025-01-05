import React from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface CustomPasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  icon?: IconType | LucideIcon;
  showPassword?: boolean;
  setShowPassword?: (showPassword: boolean) => void;
}

const CustomPasswordInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  className,
  error,
  onChange,
  showPassword,
  icon: Icon,
}: CustomPasswordInputProps<T>) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  return (
    <FormItem className="flex flex-col gap-x-0">
      <FormLabel
        htmlFor={`${name}-input`}
        className="text-sm font-medium m-0 -mb-1 text-muted-foreground"
      >
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground"
            />
          )}
          <Input
            id={`${name}-input`}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            className={cn(
              "pr-10 rounded-xl border-opacity-40 border-zinc-500",
              !!Icon && "pl-10",
              className
            )}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
          />
          {/* <Hint label={`${showPassword ? "hide password" : "show password"}`}>
            <Button
              type="button"
             
              variant="ghost"
              className="absolute size-8   right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="size-3.5 text-muted-foreground" />
              ) : (
                <Eye className="size-3.5 text-muted-foreground" />
              )}
            </Button>
          </Hint> */}
        </div>
      </FormControl>
      <FormMessage>
        {(error || fieldError?.message) && (
          <span className="text-xs text-red-600">
            {error || fieldError?.message}
          </span>
        )}
      </FormMessage>
    </FormItem>
  );
};

export default CustomPasswordInput;
