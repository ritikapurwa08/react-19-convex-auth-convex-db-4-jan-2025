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
  useFormContext,
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

interface CustomImageUrlInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
}

export default function CustomImageUrlInput<T extends FieldValues>({
  name,
  className,
  placeholder,
  icon: Icon,
  disabled,
  label,
  control,
  defaultValue,
}: Readonly<CustomImageUrlInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });
  const { setError, clearErrors } = useFormContext();

  const [imageUrl, setImageUrl] = useState(field.value || "");
  const [debouncedImageUrl] = useDebounce(imageUrl, 500); // Debounce for 500ms
  const [isValidImage, setIsValidImage] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setImageUrl(field.value || "");
  }, [field.value]);

  useEffect(() => {
    const validateImageUrl = async (url: string) => {
      if (!url) {
        setIsValidImage(null);
        clearErrors(name);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");
        const isValid = contentType?.startsWith("image/") ?? false;
        setIsValidImage(isValid);
        if (!isValid) {
          setError(name, {
            type: "manual",
            message: "This URL does not point to a valid image.",
          });
        } else {
          clearErrors(name);
        }
      } catch (error) {
        setIsValidImage(false);
        setError(name, {
          type: "manual",
          message: "This URL does not point to a valid image.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedImageUrl) {
      validateImageUrl(debouncedImageUrl);
    } else {
      setIsValidImage(null);
      clearErrors(name);
    }
  }, [debouncedImageUrl, name, setError, clearErrors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setImageUrl(value);
    field.onChange(value); // Update form value
  };

  return (
    <FormItem className="relative min-w-full px-4">
      <div
        className={cn(
          "mt-4 transition-all w-full h-full duration-300 ease-in-out",
          debouncedImageUrl && isValidImage
            ? "opacity-100 scale-100" // Visible state
            : "opacity-0 scale-95" // Hidden state
        )}
      >
        {debouncedImageUrl && isValidImage && (
          <img
            src={debouncedImageUrl}
            alt="Preview"
            className="rounded-xl  overflow-hidden border object-cover"
          />
        )}
      </div>
      <FormLabel
        htmlFor={`${name}-input`}
        className={"text-sm mb-0.5 ml-2 font-medium block"}
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
            value={imageUrl}
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
            ) : debouncedImageUrl && isValidImage !== null ? (
              isValidImage ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )
            ) : null}
          </div>
        </div>
      </FormControl>

      {/* Image Preview */}

      <FormMessage className="mt-1 text-xs text-red-600">
        {fieldError?.message && <span>{fieldError.message}</span>}
        {debouncedImageUrl && isValidImage === false && (
          <span>This URL does not point to a valid image.</span>
        )}
      </FormMessage>
    </FormItem>
  );
}
