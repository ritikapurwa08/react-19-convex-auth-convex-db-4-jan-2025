import { Doc } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BlogFormUpdateDialog from "./blog-form-update";
import BlogFormRemoveDialog from "./blog-form-remove-dialog";

import { format } from "date-fns";
import {
  AddBlogLikeButton,
  RemoveBlogLikeButton,
  SaveBlogButton,
  UnsaveBlogButton,
} from "./blog-interactions-buttons";
import { useBlogInteraction } from "../hooks/use-get-blog-interactions";
import { useCurrentUser } from "@/components/auth/hooks/get-current-user";
import { default_blog_photo } from "@/storage/images"; // Make sure this path is correct
import { TotalLikedAndSaved } from "../hooks/blog-interaction-hook";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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
  name,
  image,
  imageUrl,
  updatedAt,
  showRemoveButton,
  showUpdateButton,
}: BlogsAdminType) => {
  const formattedCreationTime = format(new Date(_creationTime), "PPpp");
  const formattedUpdatedAt = updatedAt
    ? format(new Date(updatedAt), "PPpp")
    : null;

  const { user } = useCurrentUser();
  const userId = user?._id;

  const interaction = useBlogInteraction(userId!, _id);

  const isLiked = interaction?.isLiked || false;
  const isSaved = interaction?.isSaved || false;

  // Use default image if imageUrl is not provided
  const displayImageUrl = imageUrl || default_blog_photo;

  const { totalLikes } = TotalLikedAndSaved({ blogId: _id });

  const navigate = useNavigate();

  return (
    <Card
      key={`${authorId} ${_id} ${image}`}
      className="max-w-2xl mx-auto my-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <CardContent className="p-0">
        <div
          onClick={() => navigate(`/blogs/${_id}`)}
          className="relative overflow-hidden h-64 w-full"
        >
          <img
            src={displayImageUrl}
            alt={name}
            className="rounded-t-lg object-cover h-full w-full"
          />
        </div>
      </CardContent>
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl line-clamp-2 font-bold text-gray-900">
          {name}
        </CardTitle>
        <CardDescription className="space-y-4">
          <div id="content" className="text-gray-700">
            {content}
          </div>
          <div
            id="blog-details"
            className="flex justify-between items-center mt-4"
          >
            <span
              onClick={() => navigate(`/author/${authorId}`)}
              id="authorName"
              className="text-sm hover:text-blue-500 transition-all duration-300 ease-in-out font-semibold text-gray-600"
            >
              By {authorName}
            </span>
            <div id="date-details" className="text-sm text-gray-500">
              <span>Created: {formattedCreationTime}</span>
              {formattedUpdatedAt && (
                <span> | Updated: {formattedUpdatedAt}</span>
              )}
            </div>
          </div>
          <div
            id="blog-interactions"
            className="flex  justify-around flex-row gap-x-2"
          >
            <div id="like-button">
              {userId &&
                (isLiked ? (
                  <RemoveBlogLikeButton blogId={_id} userId={userId} />
                ) : (
                  <div className="flex flex-row">
                    <AddBlogLikeButton blogId={_id} userId={userId} />
                  </div>
                ))}
            </div>

            <div id="total-likes">
              <Button variant="outline" size="icon" className="">
                {totalLikes === undefined ? (
                  <Badge variant="secondary" className="animate-pulse">
                    Loading...
                  </Badge>
                ) : (
                  <Badge variant="secondary"> {totalLikes}</Badge>
                )}
              </Button>
            </div>
            <div id="update-button">
              {showUpdateButton && <BlogFormUpdateDialog blogId={_id} />}
            </div>

            <div id="remove-button">
              {showRemoveButton && <BlogFormRemoveDialog blogId={_id} />}
            </div>

            <div id="save-button">
              {userId &&
                (isSaved ? (
                  <UnsaveBlogButton blogId={_id} userId={userId} />
                ) : (
                  <SaveBlogButton blogId={_id} userId={userId} />
                ))}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BlogCard;
