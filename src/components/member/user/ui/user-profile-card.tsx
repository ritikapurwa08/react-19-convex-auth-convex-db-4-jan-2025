import { Doc } from "@convex/_generated/dataModel";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCustomImageProfile from "./user-custom-profile-image";
import {
  useGetUserCreatedPaginatedBlogs,
  useGetUserSavedPaginatedBlogs,
  useUserLikedPaginatedBlogs,
} from "@/hooks/blogs/query/blog-paginated-queries";
import BlogCard from "@/components/blogs/ui/blog-card";
import BlogsLoadingCards from "@/components/blogs/ui/blog-loading-cards";
import FollowingFollowersButtons from "./following-list-dialog";
import {
  Mail,
  Phone,
  MapPin,
  Cake,
  Calendar,
  Clock,
  Heart,
  Bookmark,
  FileText,
} from "lucide-react"; // Import icons from lucide-react

type UserProfileCardProps = Doc<"users">;

const UserProfileCard = ({
  _creationTime,
  _id,
  email,
  name,
  role,
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

  const ProfilePageHeader = () => {
    return (
      <div
        id="profile-page-header"
        className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 sm:gap-8 p-4 sm:p-6"
      >
        <div id="profile-picture" className="flex-shrink-0">
          <UserCustomImageProfile
            name={name}
            userName={userName}
            role={role}
            personId={_id}
          />
        </div>

        <div id="follower&follwing" className="flex-shrink-0">
          <FollowingFollowersButtons userId={_id} />
        </div>
      </div>
    );
  };

  const ProfilePageUserDetails = () => {
    return (
      <div
        id="user-details"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6"
      >
        <div id="contact" className="space-y-4">
          <div id="Email" className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
          <div id="contact-email" className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="font-medium">{contactEmail || "Not provided"}</p>
            </div>
          </div>
          <div id="mobile-number" className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Mobile Number</p>
              <p className="font-medium">{mobileNumber || "Not provided"}</p>
            </div>
          </div>
          <div id="address" className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{address || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div id="user-info" className="space-y-4">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{age || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">{formattedCreationTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formattedUpdatedTime}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfilePageBlogSection = () => {
    const BlogLoadingCards = () => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <BlogsLoadingCards key={index} />
          ))}
        </div>
      );
    };

    const EmptyBlogSection = ({
      section,
    }: {
      section: "liked" | "create" | "saved";
    }) => {
      const iconProps = {
        className: "w-12 h-12 text-muted-foreground mx-auto",
      };
      return (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          {section === "liked" && <Heart {...iconProps} />}
          {section === "create" && <FileText {...iconProps} />}
          {section === "saved" && <Bookmark {...iconProps} />}
          <p className="text-muted-foreground text-center">
            {section === "liked" && "You have not liked any blogs yet."}
            {section === "create" && "You have not created any blogs yet."}
            {section === "saved" && "You have not saved any blogs yet."}
          </p>
        </div>
      );
    };

    return (
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="created">Created Blogs</TabsTrigger>
          <TabsTrigger value="liked">Liked Blogs</TabsTrigger>
          <TabsTrigger value="saved">Saved Blogs</TabsTrigger>
        </TabsList>
        <div className="border-t pt-4">
          <TabsContent value="created">
            {isCreatedBlogsLoading ? (
              <BlogLoadingCards />
            ) : createdBlogs?.length === 0 ? (
              <EmptyBlogSection section="create" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdBlogs?.map((blog) => (
                  <BlogCard key={blog._id} {...blog} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="liked">
            {isLikedBlogsLoading ? (
              <BlogLoadingCards />
            ) : likedBlogs?.length === 0 ? (
              <EmptyBlogSection section="liked" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedBlogs?.map((blog) => (
                  <BlogCard key={blog._id} {...blog} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="saved">
            {isSavedBlogsLoading ? (
              <BlogLoadingCards />
            ) : savedBlogs?.length === 0 ? (
              <EmptyBlogSection section="saved" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBlogs?.map((blog) => (
                  <BlogCard key={blog._id} {...blog} />
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    );
  };

  return (
    <div key={_id} className="max-w-6xl mx-auto p-4 sm:p-6">
      <ProfilePageHeader />
      <ProfilePageUserDetails />
      <ProfilePageBlogSection />
    </div>
  );
};

export default UserProfileCard;
