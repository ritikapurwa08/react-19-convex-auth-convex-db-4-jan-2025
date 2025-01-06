import { useState } from "react";
import { Doc, Id } from "@convex/_generated/dataModel";
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
  DialogTrigger,
} from "@/components/ui/dialog"; // Import shadcn dialog components
import { Button } from "@/components/ui/button"; // Import shadcn button component

type User = Doc<"users">;
interface FollowingListDialogProps {
  userId: Id<"users">;
}

// Following Section Component
const FollowingSection = ({
  userId,
  isLoading,
  followingList,
}: {
  userId: Id<"users">;
  isLoading: boolean;
  followingList: User[]; // Replace `any` with the correct type for your user data
}) => {
  return (
    <>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Following</h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading following list...</p>
        ) : followingList.length > 0 ? (
          followingList.map((user) => (
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
    </>
  );
};

// Followers Section Component
const FollowersSection = ({
  userId,
  isLoading,
  followersList,
}: {
  userId: Id<"users">;
  isLoading: boolean;
  followersList: User[]; // Replace `any` with the correct type for your user data
}) => {
  return (
    <>
      <div className="p-4 border-t">
        <h2 className="text-lg font-semibold">Followers</h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading followers list...</p>
        ) : followersList.length > 0 ? (
          followersList.map((user) => (
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
    </>
  );
};

// Main Component
const FollowingListDialog = ({ userId }: FollowingListDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch following list
  const { followingList, isLoading: isFollowingListLoading } =
    useGetUserFollowingList({ userId });

  // Fetch followers list
  const { followersList, isLoading: isFollowersListLoading } =
    useGetUserFollowersList({ userId });

  // Fetch total following count
  const { isLoading: isTotalFollowingLoading, totalFollowing } =
    useGetUserTotalFollowing({ userId });

  // Fetch total followers count
  const { isLoading: isTotalFollowersLoading, totalFollowers } =
    useGetUserTotalFollowers({ userId });

  // Loading state
  const isLoading =
    isFollowingListLoading ||
    isFollowersListLoading ||
    isTotalFollowingLoading ||
    isTotalFollowersLoading;

  // Ensure followingList and followersList are not undefined
  const safeFollowingList = followingList || [];
  const safeFollowersList = followersList || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dialog Trigger Button */}
      <DialogTrigger asChild>
        <Button
          disabled={isLoading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              Following: {totalFollowing} | Followers: {totalFollowers}
            </>
          )}
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Following and Followers</DialogTitle>
        </DialogHeader>

        {/* Render Following Section */}
        <FollowingSection
          userId={userId}
          isLoading={isFollowingListLoading}
          followingList={safeFollowingList}
        />

        {/* Render Followers Section */}
        <FollowersSection
          userId={userId}
          isLoading={isFollowersListLoading}
          followersList={safeFollowersList}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FollowingListDialog;
