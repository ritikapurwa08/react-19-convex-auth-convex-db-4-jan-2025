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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CustomTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => Promise<void>;
}

export default function CustomTextarea<T extends FieldValues>({
  name,
  className,
  error,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  rows = 4,
  maxLength,
  onChange,
}: Readonly<CustomTextareaProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });

  return (
    <FormItem className="relative">
      <FormLabel className="text-sm  font-medium mb-0.5 ml-2 mt-1 block">
        {label}
      </FormLabel>

      <FormControl>
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className="absolute top-4 w-10 transform left-0 text-muted-foreground"
            />
          )}

          <Textarea
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "resize-none pr-10 rounded-xl border-opacity-30 border-zinc-500",
              !!Icon && "pl-10",
              className
            )}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
          />

          {maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {field.value?.length ?? 0}/{maxLength}
            </div>
          )}
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
