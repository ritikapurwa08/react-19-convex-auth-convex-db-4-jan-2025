import { useState } from "react";

import { UpdateCustomProfileImageHook } from "@/hooks/member/user/query/users-muation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { localImageOptions } from "./userprofile";
import { useToast } from "@/hooks/use-toast";
import { UseGetCurrentUserQueryHook } from "@/hooks/member/user/user-query-hooks";

type UserCustomImageProfile = {
  customProfilePicture: string;
};

const UserCustomImageProfile = ({
  customProfilePicture,
}: UserCustomImageProfile) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: updateCustomProfile, isPending: updatingCustomProfile } =
    UpdateCustomProfileImageHook();

  const { user } = UseGetCurrentUserQueryHook();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!selectedImage) {
      toast({
        variant: "default",
        description: "Please select an image.",
      });
      return;
    }

    await updateCustomProfile(
      { authorProfileImage: selectedImage },
      {
        onSuccess() {
          toast({
            variant: "default",
            description: "Updated successfully",
          });
          console.log(customProfilePicture);
          setIsDialogOpen(false);
          // Refetch user data after successful update
        },
        onError(error) {
          toast({
            variant: "destructive",
            description: `${error.message} Failed to update profile image.`,
          });
        },
      }
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Find the current image object based on the saved value
  const currentImage = localImageOptions.find(
    (img) => img.value === customProfilePicture
  );

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Display the current profile image and label */}
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage
            src={currentImage?.image || "/images/default-profile.png"}
            alt="Profile"
          />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <span className="mt-2">{currentImage?.label || "Default Profile"}</span>
      </div>

      {/* Button to open the selection dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Change Profile Image</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Profile Image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {localImageOptions.map((image) => (
              <div
                key={image.value}
                onClick={() => setSelectedImage(image.value)}
                className={`cursor-pointer size-10  border-2 ${
                  selectedImage === image.value
                    ? "border-blue-500"
                    : "border-transparent"
                } rounded-lg overflow-hidden`}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={image.image}
                    alt={image.label}
                    className="w-full aspect-square object-cover"
                  />
                  <span className="mt-2">{image.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updatingCustomProfile || !selectedImage}
            >
              {updatingCustomProfile ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserCustomImageProfile;
