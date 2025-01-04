import { useState, useEffect } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectOption {
  value: string;
  label: string;
  image: string;
}

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  onImageChange?: (imageUrl: string) => void; // Callback for image change
}

export default function CustomProfileSelect<T extends FieldValues>({
  name,
  className,
  error,
  disabled,
  control,
  options,
  onChange,
  onImageChange,
}: Readonly<CustomSelectProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control });
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    options[0]?.image
  ); // Initialize with the first option's image

  useEffect(() => {
    // Update selectedImage when field.value changes
    const selectedOption = options.find(
      (option) => option.value === field.value
    );
    if (selectedOption) {
      setSelectedImage(selectedOption.image);
      onImageChange?.(selectedOption.image);
    }
  }, [field.value, options, onImageChange]);

  const handleValueChange = (value: string) => {
    field.onChange(value);
    onChange?.(value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setSelectedImage(selectedOption.image);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={selectedImage || ""}
        alt="Profile Picture"
        width={60}
        height={60}
        className="rounded-full"
      />

      <FormItem>
        <FormControl>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={className}
              >
                Change
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-auto grid grid-cols-3 p-3"
            >
              {options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => handleValueChange(option.value)}
                  className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 p-2"
                >
                  <img
                    src={option.image}
                    alt={option.label}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </FormControl>
        <FormMessage className="mt-1 text-xs text-red-600">
          {(error ?? fieldError?.message) && (
            <span>{error ?? fieldError?.message}</span>
          )}
        </FormMessage>
      </FormItem>
    </div>
  );
}
