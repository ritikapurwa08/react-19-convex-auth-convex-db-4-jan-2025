import { Button } from "@/components/ui/button"; // Import shadcn Button
import {
  FollowUserHook,
  UnfollowUserHook,
} from "@/hooks/member/user/query/users-muation";
import {
  CheckIfFollowingHook,
  GetUserByIdHook,
} from "@/hooks/member/user/user-query-hooks";
import { Id } from "@convex/_generated/dataModel";
import { Loader2 } from "lucide-react"; // Import a loading spinner from lucide-react

type AuthorProfileCardProps = {
  authorId: Id<"users">;
};

const AuthorProfileCard = ({ authorId }: AuthorProfileCardProps) => {
  // Fetch user data
  const { user } = GetUserByIdHook({ userId: authorId });

  // Follow/Unfollow hooks
  const { mutate: followUser, isPending: followingUser } = FollowUserHook();
  const { mutate: unfollowUser, isPending: unfollowingUser } =
    UnfollowUserHook();
  const { checkIfFollow } = CheckIfFollowingHook({ userIdToCheck: authorId });

  // Handle follow/unfollow actions
  const handleFollow = () => {
    followUser({ userIdToFollow: authorId });
  };

  const handleUnfollow = () => {
    unfollowUser({ userIdToUnfollow: authorId });
  };

  // Loading or error states
  if (!user) {
    return (
      <div>
        <h1>No user found</h1>
      </div>
    );
  }

  if (user === undefined) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  const { name, userName, address } = user;

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-gray-600">@{userName}</p>
      <p className="text-sm text-gray-500">{address}</p>

      {/* Follow/Unfollow Button */}
      {checkIfFollow ? (
        <Button
          variant="outline"
          onClick={handleUnfollow}
          disabled={unfollowingUser}
          className="mt-4 w-full"
        >
          {unfollowingUser ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Unfollowing...
            </>
          ) : (
            "Unfollow"
          )}
        </Button>
      ) : (
        <Button
          onClick={handleFollow}
          disabled={followingUser}
          className="mt-4 w-full"
        >
          {followingUser ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Following...
            </>
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </div>
  );
};

export default AuthorProfileCard;
