import { Button } from "@/components/ui/button"; // Import shadcn Button
import {
  FollowUserHook,
  UnfollowUserHook,
} from "@/hooks/member/user/query/users-muation";
import { CheckIfFollowingHook } from "@/hooks/member/user/user-query-hooks";
import { Id } from "@convex/_generated/dataModel";
import { Loader2 } from "lucide-react"; // Import a loading spinner from lucide-react

type AuthorFollowButtonProps = {
  authorId: Id<"users">;
  smallButton?: boolean;
};

const AuthorFollowButton = ({ authorId }: AuthorFollowButtonProps) => {
  const { mutate: followUser, isPending: followingUser } = FollowUserHook();
  const { mutate: unfollowUser, isPending: unfollowingUser } =
    UnfollowUserHook();
  const { checkIfFollow } = CheckIfFollowingHook({ userIdToCheck: authorId });

  const handleFollow = () => {
    followUser({ userIdToFollow: authorId });
  };

  const handleUnfollow = () => {
    unfollowUser({ userIdToUnfollow: authorId });
  };

  return (
    <div className="">
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

export default AuthorFollowButton;
