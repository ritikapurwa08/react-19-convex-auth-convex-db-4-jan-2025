import { useState } from "react";
import { Id } from "@convex/_generated/dataModel";
import {
  useGetUserFollowersList,
  useGetUserFollowingList,
  useGetUserTotalFollowers,
  useGetUserTotalFollowing,
} from "@/hooks/member/user/user-query-hooks";
import UserCardSmall from "./following-follower-user-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FollowingDialogProps {
  userId: Id<"users">;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const FollowingDialog = ({
  userId,
  isOpen,
  onOpenChange,
}: FollowingDialogProps) => {
  const { followingList, isLoading: isFollowingListLoading } =
    useGetUserFollowingList({ userId });
  const { isLoading: isTotalFollowingLoading, totalFollowing } =
    useGetUserTotalFollowing({ userId });

  const isLoading = isFollowingListLoading || isTotalFollowingLoading;
  const safeFollowingList = followingList || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Following ({totalFollowing})</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {isLoading ? (
            <p className="text-gray-500 text-center">
              Loading following list...
            </p>
          ) : safeFollowingList.length > 0 ? (
            safeFollowingList.map((user) => (
              <UserCardSmall
                key={user._id}
                userId={user._id}
                name={user.name}
                userName={user.userName}
                customProfilePicture={user.customProfilePicture}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No users found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FollowersDialogProps {
  userId: Id<"users">;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const FollowersDialog = ({
  userId,
  isOpen,
  onOpenChange,
}: FollowersDialogProps) => {
  const { followersList, isLoading: isFollowersListLoading } =
    useGetUserFollowersList({ userId });
  const { isLoading: isTotalFollowersLoading, totalFollowers } =
    useGetUserTotalFollowers({ userId });

  const isLoading = isFollowersListLoading || isTotalFollowersLoading;
  const safeFollowersList = followersList || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Followers ({totalFollowers})</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {isLoading ? (
            <p className="text-gray-500 text-center">
              Loading followers list...
            </p>
          ) : safeFollowersList.length > 0 ? (
            safeFollowersList.map((user) => (
              <UserCardSmall
                key={user._id}
                userId={user._id}
                name={user.name}
                userName={user.userName}
                customProfilePicture={user.customProfilePicture}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No users found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from "@/components/ui/button";
interface FollowingFollowersButtonsProps {
  userId: Id<"users">;
}

const FollowingFollowersButtons = ({
  userId,
}: FollowingFollowersButtonsProps) => {
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);

  return (
    <div className="flex gap-2">
      {/* Following Button */}
      <Button
        variant="outline"
        size="lg"
        type="button"
        onClick={() => setIsFollowingDialogOpen(true)}
      >
        Following
      </Button>

      {/* Followers Button */}
      <Button
        variant="outline"
        size="lg"
        type="button"
        onClick={() => setIsFollowersDialogOpen(true)}
      >
        Followers
      </Button>

      {/* Following Dialog */}
      <FollowingDialog
        userId={userId}
        isOpen={isFollowingDialogOpen}
        onOpenChange={setIsFollowingDialogOpen}
      />

      {/* Followers Dialog */}
      <FollowersDialog
        userId={userId}
        isOpen={isFollowersDialogOpen}
        onOpenChange={setIsFollowersDialogOpen}
      />
    </div>
  );
};

export default FollowingFollowersButtons;
