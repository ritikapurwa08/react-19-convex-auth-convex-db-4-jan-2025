import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UseGetBlogByIdHook } from "@/hooks/blogs/query/blog-query-hooks";
import { Doc, Id } from "@convex/_generated/dataModel";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SearchedBlogPage = () => {
  const { id: blogId } = useParams<{ id: Id<"blogs"> }>();
  const navigate = useNavigate();

  // Handle missing blogId
  if (!blogId) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Oops! Blog Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the blog you're looking for. It may have been moved,
          deleted, or the URL might be incorrect.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ChevronLeft className="mr-2" />
          Go Back to Home
        </Button>
      </div>
    );
  }

  // Fetch the blog using the custom hook
  const { blog: ClickedBlog } = UseGetBlogByIdHook({ blogId });

  // Handle loading state
  if (ClickedBlog === undefined) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Handle case where the blog is not found
  if (ClickedBlog === null) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Oops! Blog Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the blog you're looking for. It may have been moved,
          deleted, or the URL might be incorrect.
        </p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ChevronLeft className="mr-2" />
          Go Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-4 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="mr-2" />
        Go Back
      </Button>
      <SearchedBlogCard {...ClickedBlog} />
    </div>
  );
};

export default SearchedBlogPage;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, TimerIcon } from "lucide-react";
import { format } from "date-fns";

type BlogCardProps = Doc<"blogs">;

const SearchedBlogCard = ({
  _creationTime,
  _id,
  authorName,
  content,
  title,
  convexStorageUrl,
  updatedAt,
}: BlogCardProps) => {
  // Format dates
  const creationDate = format(new Date(_creationTime), "MMMM dd, yyyy");
  const updatedDate = updatedAt
    ? format(new Date(updatedAt), "MMMM dd, yyyy")
    : null;

  return (
    <Card
      key={_id}
      className="shadow-lg overflow-hidden transition-transform hover:scale-105"
    >
      {/* Blog Image with Gradient Overlay */}
      <div className="relative w-full h-64 sm:h-96 overflow-hidden">
        <img
          src={convexStorageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Card Header */}
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <UserIcon className="h-4 w-4 mr-1" />
            {authorName}
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {creationDate}
          </Badge>
          {updatedDate && (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <TimerIcon className="h-4 w-4 mr-1" />
              Updated: {updatedDate}
            </Badge>
          )}
        </div>
        <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </CardContent>
    </Card>
  );
};
