// components/custom-email-input.tsx
"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useCheckEmail } from "../../hooks/auth/query/check-email";

interface CustomEmailInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
}

export default function CustomEmailInput<T extends FieldValues>({
  name,
  className,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  defaultValue,
}: Readonly<CustomEmailInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  const [email, setEmail] = useState(field.value || "");
  const [debouncedEmail] = useDebounce(email, 100); // Debounce for 500ms

  const { checkEmail, isLoading } = useCheckEmail({ email: debouncedEmail });

  useEffect(() => {
    setEmail(field.value || "");
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    field.onChange(value); // Update form value
  };

  return (
    <FormItem className="relative flex flex-col gap-y-0.5">
      <FormLabel
        htmlFor={`${name}-input`}
        className="text-sm font-medium m-0 -mb-1.5 ml-1 text-muted-foreground"
      >
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className={
                "absolute top-1/2 w-10 transform -translate-y-1/2 left-0 text-muted-foreground"
              }
            />
          )}

          <Input
            id={`${name}-input`}
            placeholder={placeholder}
            value={email}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "pr-10 border-opacity-30 rounded-xl border-zinc-500",
              !!Icon && "pl-10",
              className
            )}
          />

          {/* Loading and Validation Icons */}
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : debouncedEmail && checkEmail !== undefined ? (
              checkEmail ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )
            ) : null}
          </div>
        </div>
      </FormControl>

      <FormMessage className="mt-1 text-xs text-red-600">
        {fieldError?.message && <span>{fieldError.message}</span>}
        {debouncedEmail && checkEmail && (
          <span>This email is already registered.</span>
        )}
      </FormMessage>
    </FormItem>
  );
}
