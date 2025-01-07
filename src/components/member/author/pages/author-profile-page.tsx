import { useParams } from "react-router-dom";

import { Id } from "@convex/_generated/dataModel";
import AuthorProfileCard from "../ui/author-profile-card";
import { GetUserByIdHook } from "@/hooks/member/user/user-query-hooks";

const AuthorProfilePage = () => {
  // For React Router
  const { authorId } = useParams<{ authorId: Id<"users"> }>();

  if (!authorId) {
    return <div>Author not found</div>;
  }

  const { user } = GetUserByIdHook({ userId: authorId });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AuthorProfileCard
        showSavedBlogsToOther={true}
        authorId={authorId}
        {...user}
      />
    </div>
  );
};

export default AuthorProfilePage;
