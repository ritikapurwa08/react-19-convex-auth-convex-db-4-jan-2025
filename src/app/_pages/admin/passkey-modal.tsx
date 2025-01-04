import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { X } from "lucide-react"; // Using Lucide React for the close icon
import { decryptKey, encryptKey } from "@/lib/utils";

export const PasskeyModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey = localStorage.getItem("accessKey");

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (location.pathname === "/admin") {
      if (accessKey === import.meta.env.VITE_ADMIN_PASSKEY) {
        setOpen(false); // Close modal if passkey is valid
      } else {
        setOpen(true); // Open modal if passkey is invalid or missing
      }
    }
  }, [encryptedKey, location.pathname]);

  const closeModal = () => {
    setOpen(false);
    navigate("/"); // Redirect to home page
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === import.meta.env.VITE_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);
      setOpen(false);
      navigate("/admin"); // Redirect to admin page
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white rounded-lg shadow-xl p-6 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between text-xl font-semibold text-gray-900">
            Admin Access Verification
            <X
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={closeModal}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-gray-600">
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="flex justify-center space-x-2">
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-12 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={validatePasskey}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
