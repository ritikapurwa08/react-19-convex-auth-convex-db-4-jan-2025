import { Doc, Id } from "@convex/_generated/dataModel";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UseGetCurrentUserQueryHook } from "@/hooks/member/user/user-query-hooks";

type AuthorProfileType = Doc<"users"> & {
  totalBlogs?: number;
};

const AuthorProfileCard = ({
  _creationTime,
  _id,
  email,
  name,
  totalBlogs,
}: AuthorProfileType) => {
  return (
    <div
      key={_id}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{email}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Joined on {format(new Date(_creationTime), "MMMM d, yyyy")}
        </p>
        {totalBlogs !== undefined && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalBlogs} {totalBlogs === 1 ? "blog" : "blogs"} published
          </p>
        )}
      </div>
    </div>
  );
};

const AuthorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: Id<"users"> }>();

  // Handle missing ID
  if (!id) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            The user you are looking for does not exist.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { user, error, isLoading } = UseGetCurrentUserQueryHook();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Something Went Wrong
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            We couldn't fetch the user data. Please try again later.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Author Profile Card */}
      <AuthorProfileCard
        {...user}
        // Assuming `totalBlogs` is fetched or calculated
      />

      {/* Blog List (Optional) */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Blogs
        </h2>
      </div>
    </div>
  );
};

export default AuthorProfile;
