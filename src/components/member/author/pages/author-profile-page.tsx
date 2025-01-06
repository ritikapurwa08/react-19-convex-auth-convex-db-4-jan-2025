import { useParams } from "react-router-dom";

import { Id } from "@convex/_generated/dataModel";
import AuthorProfileCard from "../ui/author-profile-card";

const AuthorProfilePage = () => {
  // For React Router
  const { authorId } = useParams<{ authorId: Id<"users"> }>();

  if (!authorId) {
    return <div>Author not found</div>;
  }

  return (
    <div>
      <AuthorProfileCard authorId={authorId} />
    </div>
  );
};

export default AuthorProfilePage;
