import React, { useCallback } from "react";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CustomNumberInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function CustomNumberInput<T extends FieldValues>({
  name,
  className,
  error,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  onChange,
}: Readonly<CustomNumberInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  const formatPrice = (value: string) => {
    if (value) {
      const price = parseFloat(value);
      return isNaN(price) ? "0" : price.toFixed(2);
    }
    return "0.00";
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parsedValue = parseFloat(formatPrice(numericValue));

      field.onChange({
        ...e,
        target: { ...e.target, value: isNaN(parsedValue) ? null : parsedValue },
      });
      onChange?.(e);
    },
    [field, onChange]
  );

  return (
    <FormItem className="relative">
      <FormLabel
        htmlFor={`${name}-input`}
        className={"text-sm   mb-0.5 ml-2 font-medium  block"}
      >
        {label}
      </FormLabel>

      <FormControl>
        <div className={"relative"}>
          {Icon && (
            <Icon
              size={20}
              className={
                "absolute top-1/2   w-10 transform -translate-y-1/2  left-0 text-muted-foreground"
              }
            />
          )}

          <Input
            id={`${name}-input`}
            placeholder={placeholder}
            type="text"
            {...field}
            disabled={disabled}
            className={cn(
              "pr-10  border-opacity-30 rounded-xl border-zinc-500 text-right",
              !!Icon && "pl-10",
              className
            )}
            onChange={handleInputChange}
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            USD
          </span>
        </div>
      </FormControl>
      <FormMessage className="mt-1 text-xs text-red-600">
        {(error ?? fieldError?.message) && (
          <span>{error ?? fieldError?.message}</span>
        )}
      </FormMessage>
    </FormItem>
  );
}
