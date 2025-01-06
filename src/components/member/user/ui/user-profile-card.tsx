import { Doc } from "@convex/_generated/dataModel";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCustomImageProfile from "./user-custom-profile-image";
import {
  useGetUserCreatedPaginatedBlogs,
  useGetUserSavedPaginatedBlogs,
  useUserLikedPaginatedBlogs,
} from "@/hooks/blogs/query/blog-paginated-queries";
import { useGetUserTotalFollowers } from "@/hooks/member/user/user-query-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/blogs/ui/blog-card";
import BlogsLoadingCards from "@/components/blogs/ui/blog-loading-cards";
import FollowingListDialog from "./following-list-dialog";

type UserProfileCardProps = Doc<"users">;

const UserProfileCard = ({
  _creationTime,
  _id,
  email,
  name,
  role,
  customProfilePicture,
  updatedAt,
  address,
  age,
  contactEmail,
  mobileNumber,
  userName,
}: UserProfileCardProps) => {
  // Format creation and update times using date-fns
  const formattedCreationTime = format(
    new Date(_creationTime),
    "MMMM dd, yyyy"
  );
  const formattedUpdatedTime = format(new Date(updatedAt), "MMMM dd, yyyy");

  // Fetch blog data
  const { results: createdBlogs, isLoading: isCreatedBlogsLoading } =
    useGetUserCreatedPaginatedBlogs(_id);
  const { results: likedBlogs, isLoading: isLikedBlogsLoading } =
    useUserLikedPaginatedBlogs(_id);
  const { results: savedBlogs, isLoading: isSavedBlogsLoading } =
    useGetUserSavedPaginatedBlogs(_id);

  // Fetch follower/following data

  const { isLoading: isTotalFollowersLoading, totalFollowers } =
    useGetUserTotalFollowers({ userId: _id });

  return (
    <div
      key={_id}
      className="flex flex-col gap-6 p-6 pb-20 border rounded-lg shadow-sm bg-background"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Profile Picture and User Details */}
        <div className="flex flex-row gap-4 items-center">
          <UserCustomImageProfile customProfilePicture={customProfilePicture} />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">@{userName}</p>
            <Badge variant="outline" className="w-fit">
              {role}
            </Badge>
          </div>
        </div>

        {/* Followers and Following */}
        <div className="flex gap-4 ml-auto">
          <Button variant="outline" className="flex-1">
            Followers:{" "}
            {isTotalFollowersLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              totalFollowers
            )}
          </Button>
          <FollowingListDialog userId={_id} />
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{email}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Contact Email</p>
          <p className="font-medium">{contactEmail || "Not provided"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Mobile Number</p>
          <p className="font-medium">{mobileNumber || "Not provided"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-medium">{address || "Not provided"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Age</p>
          <p className="font-medium">{age || "Not provided"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Member Since</p>
          <p className="font-medium">{formattedCreationTime}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="font-medium">{formattedUpdatedTime}</p>
        </div>
      </div>

      {/* Tabs for Created, Liked, and Saved Blogs */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="created">Created Blogs</TabsTrigger>
          <TabsTrigger value="liked">Liked Blogs</TabsTrigger>
          <TabsTrigger value="saved">Saved Blogs</TabsTrigger>
        </TabsList>
        <div className="border-t pt-4">
          <TabsContent value="created">
            {isCreatedBlogsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {createdBlogs?.map((blog) => <BlogCard {...blog} />)}
              </div>
            )}
          </TabsContent>
          <TabsContent value="liked">
            {isLikedBlogsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <BlogsLoadingCards key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedBlogs?.map((blog) => <BlogCard {...blog} />)}
              </div>
            )}
          </TabsContent>
          <TabsContent value="saved">
            {isSavedBlogsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {savedBlogs?.map((blog) => <BlogCard {...blog} />)}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UserProfileCard;
