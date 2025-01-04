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

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function CustomInput<T extends FieldValues>({
  name,
  className,
  error,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  onChange,
  defaultValue,
}: Readonly<CustomInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

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
            {...field}
            disabled={disabled}
            className={cn(
              "pr-10  border-opacity-30 rounded-xl border-zinc-500",
              !!Icon && "pl-10",
              className
            )}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
          />
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
