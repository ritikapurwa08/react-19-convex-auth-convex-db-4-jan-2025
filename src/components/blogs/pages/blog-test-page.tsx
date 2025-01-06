import { useCheckEmail } from "@/hooks/auth/query/check-email";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Import Button component

const BlogTestPage = () => {
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false); // Track if email has been checked
  const { checkEmail, isLoading } = useCheckEmail({ email });

  const handleCheckEmail = () => {
    setEmailChecked(true); // Mark email as checked
  };

  const isEmailValid = emailChecked && checkEmail === false; // Email is valid (not found)
  const isEmailInvalid = emailChecked && checkEmail === true; // Email is invalid (found)
  const isEmailLoading = emailChecked && isLoading; // Loading state

  return (
    <div className="p-4">
      <div className="flex space-x-2">
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailChecked(false); // Reset check status on input change
          }}
          placeholder="Enter your email"
          disabled={isEmailLoading} // Disable input while loading
          className={
            isEmailInvalid
              ? "border-red-500"
              : isEmailValid
                ? "border-green-500"
                : ""
          }
        />
        <Button
          onClick={handleCheckEmail}
          disabled={isEmailLoading || !email} // Disable button if loading or no email
        >
          Check Email
        </Button>
      </div>

      {/* Feedback Messages */}
      {isEmailLoading && <p className="mt-2 text-gray-500">Checking...</p>}
      {isEmailValid && (
        <p className="mt-2 text-green-500">Email is available!</p>
      )}
      {isEmailInvalid && (
        <p className="mt-2 text-red-500">Email is already registered.</p>
      )}
    </div>
  );
};

export default BlogTestPage;
