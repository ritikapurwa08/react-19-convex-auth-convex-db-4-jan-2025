import { Doc } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BlogFormRemoveDialog from "./blog-form-remove-dialog";
import { format } from "date-fns";
import { useCurrentUser } from "@/hooks/auth/query/get-current-user";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BlogInteractionButton } from "./blog-interactions-buttons";
import { Edit3Icon } from "lucide-react";
import { Hint } from "@/components/ui/hint";

type BlogsAdminType = Doc<"blogs"> & {
  showUpdateButton?: boolean;
  showRemoveButton?: boolean;
};

const BlogCard = ({
  _creationTime,
  _id,
  authorId,
  authorName,
  content,
  updatedAt,
  title,
  convexStorageUrl,
  localImageUrl,
}: BlogsAdminType) => {
  const formattedCreationTime = format(new Date(_creationTime), "PPpp");
  const formattedUpdatedAt = updatedAt
    ? format(new Date(updatedAt), "PPpp")
    : null;

  const { user } = useCurrentUser();
  const navigate = useNavigate();

  const handleNavigateToAuthorProfile = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    if (user?._id) {
      const OwnerOfBlog = user._id === authorId;
      if (!OwnerOfBlog) {
        navigate(`/author-profile/${authorId}`);
      } else {
        navigate("/member/user/user-profile");
      }
    }
  };

  const handleNavigateToblog = () => {
    navigate(`/blogs/${_id}`);
  };

  return (
    <Card className="max-w-2xl mx-auto min-w-full my-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0">
        <div
          onClick={handleNavigateToblog}
          className="relative overflow-hidden h-64 w-full cursor-pointer"
        >
          {/* Display both images if they exist */}
          <div className="flex h-full">
            {convexStorageUrl && (
              <img
                src={convexStorageUrl}
                alt={title}
                className="rounded-t-lg object-cover h-full w-1/2"
              />
            )}
            {localImageUrl && (
              <img
                src={localImageUrl}
                alt={title}
                className="rounded-t-lg object-cover h-full w-1/2"
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl line-clamp-2 font-bold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="space-y-4">
          <div className="text-gray-700 line-clamp-3">{content}</div>

          {/* Author and Date Details */}
          <div className="flex justify-between items-center mt-4">
            <span
              onClick={handleNavigateToAuthorProfile}
              className="text-sm hover:text-blue-500 transition-all duration-300 ease-in-out font-semibold text-gray-600 cursor-pointer"
            >
              By {authorName}
            </span>
            <div className="text-sm text-gray-500">
              {formattedUpdatedAt ? (
                <span>Updated: {formattedUpdatedAt}</span>
              ) : (
                <span>Created: {formattedCreationTime}</span>
              )}
            </div>
          </div>

          {/* Blog Interactions */}
          <div className="flex flex-row justify-center gap-x-4 items-center">
            {user?._id && (
              <BlogInteractionButton blogId={_id} userId={user._id} />
            )}

            <BlogFormRemoveDialog blogId={_id} />
            <Hint side="top" label="update Blog">
              <Link to={`/blog-update/${_id}`}>
                <Button variant="outline" className="w-fit px-5">
                  <Edit3Icon className="size-5" />
                </Button>
              </Link>
            </Hint>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BlogCard;
