// src/pages/BlogDetailPage.tsx
import { useParams } from "react-router-dom";
import { Id } from "@convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, TimerIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // Import date-fns for date formatting
import { UseGetBlogByIdHook } from "../hooks/blog-query-hooks";

const BlogDetailPage = () => {
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

  // Format the creation date using date-fns
  const creationDate = format(
    new Date(ClickedBlog._creationTime),
    "MMMM dd, yyyy"
  );
  const updatedDate = ClickedBlog.updatedAt
    ? format(new Date(ClickedBlog.updatedAt), "MMMM dd, yyyy")
    : null;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
        <ChevronLeft className="mr-2" />
        Go Back
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="rounded-full px-2 py-1">
              <UserIcon className="h-3 w-3 mr-1" />
              {ClickedBlog.authorName}
            </Badge>
            <Badge variant="outline" className="rounded-full px-2 py-1">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {creationDate}
            </Badge>
            {updatedDate && (
              <Badge variant="outline" className="rounded-full px-2 py-1">
                <TimerIcon className="h-3 w-3 mr-1" />
                Updated: {updatedDate}
              </Badge>
            )}
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold">
            {ClickedBlog.name}
          </CardTitle>
        </CardHeader>
        {/* Unique and responsive image display */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-lg">
          <img
            src={ClickedBlog.imageUrl}
            alt={ClickedBlog.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <CardContent className="prose prose-sm sm:prose-lg dark:prose-invert mt-6">
          {/* Use dangerouslySetInnerHTML to render HTML content from the database */}
          <div dangerouslySetInnerHTML={{ __html: ClickedBlog.content }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetailPage;
