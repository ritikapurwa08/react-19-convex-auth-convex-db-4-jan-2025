import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton from shadcn

const BlogsLoadingCards = () => {
  return (
    <Card className="max-w-sm mx-auto my-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <Skeleton className="relative h-64 w-full rounded-t-lg" />
      </CardContent>
      <CardHeader className="space-y-4">
        {/* Title Skeleton */}
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription className="space-y-4">
          {/* Content Skeleton */}
          <div id="content">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
            <Skeleton className="h-4 w-4/6 mt-2" />
          </div>
          {/* Author and Date Skeletons */}
          <div
            id="blog-details"
            className="flex justify-between items-center mt-4"
          >
            <span id="authorName">
              <Skeleton className="h-4 w-24" />
            </span>
            <div id="date-details">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          {/* Buttons Skeletons */}
          <div className="flex space-x-2 mt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default BlogsLoadingCards;
