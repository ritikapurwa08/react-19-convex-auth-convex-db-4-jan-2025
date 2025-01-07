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
import {
  GetUserByIdHook,
  UseGetCurrentUserQueryHook,
} from "@/hooks/member/user/user-query-hooks";
import { Id } from "@convex/_generated/dataModel";
import { Hint } from "@/components/ui/hint";

type UserCustomImageProfile = {
  personId: Id<"users">;
  name?: string;
  userName?: string;
  role?: string;
};

const UserCustomImageProfile = ({
  personId,
  name,
  userName,
}: UserCustomImageProfile) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: updateCustomProfile, isPending: updatingCustomProfile } =
    UpdateCustomProfileImageHook();

  const { user } = GetUserByIdHook({ userId: personId });
  const { user: currentUser } = UseGetCurrentUserQueryHook();

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

  if (!user || !currentUser) {
    return <div>Loading...</div>;
  }

  // Check if the current user is the owner of the profile
  const isOwner = currentUser._id === user._id;

  // Find the current image object based on the saved value
  const currentImage = localImageOptions.find(
    (img) => img.value === user.customProfilePicture
  );

  return (
    <div className="flex flex-col items-center  p-3">
      {/* Display the current profile image and label */}
      <div className="flex flex-col items-center">
        <Avatar className="size-20">
          <AvatarImage
            src={currentImage?.image || "/images/default-profile.png"}
            alt="Profile"
          />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div id="user-user-name-role" className="flex flex-col gap-0.5">
          <div
            id="name-userName"
            className="flex flex-row items-center justify-center gap-x-0.5"
          >
            <span className="font-bold font-mono text-xl">{name}</span>{" "}
            <span className="text-muted-foreground text-xs " id="username">
              ({userName})
            </span>
          </div>
        </div>
      </div>

      {/* Conditionally render the "Change Profile Image" button */}
      {isOwner && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Change</Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Select a Profile Image</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-5  lg:grid-cols-6 gap-4">
              {localImageOptions.map((image) => (
                <div
                  key={image.value}
                  onClick={() => setSelectedImage(image.value)}
                  className={`cursor-pointer size-20 border-2 ${
                    selectedImage === image.value &&
                    currentImage?.value !== image.value
                      ? "border-blue-500 border-2"
                      : "border-transparent"
                  } rounded-lg overflow-hidden`}
                >
                  <Hint key={image.label} label={image.label}>
                    <div className="flex flex-col items-center">
                      <img
                        src={image.image}
                        alt={image.label}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  </Hint>
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
      )}
    </div>
  );
};

export default UserCustomImageProfile;
