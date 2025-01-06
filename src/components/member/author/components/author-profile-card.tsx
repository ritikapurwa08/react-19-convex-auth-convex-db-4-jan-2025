import { format } from "date-fns";
import { Mail, Phone, User, Clock, CheckCircle } from "lucide-react";
import { Doc } from "@convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type AuthorCardProps = Doc<"users">;

const AuthorProfileCard = ({
  _creationTime,
  _id,
  email,
  followers,
  following,
  likedBlogs,
  name,
  role,
  savedBlogs,
  updatedAt,
  address,
  age,
  contactEmail,
  customProfilePicture,
  mobileNumber,
  userName,
}: AuthorCardProps) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={
              customProfilePicture ||
              `https://source.unsplash.com/random/100x100?sig=${_id}`
            }
            alt={name}
          />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{name || userName}</CardTitle>
          <CardDescription>{role || "User"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email */}
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <span>{email}</span>
          {contactEmail && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>

        {/* Mobile Number */}
        {mobileNumber && (
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-500" />
            <span>{mobileNumber}</span>
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>{address}</span>
          </div>
        )}

        {/* Age */}
        {age && (
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>Age: {age}</span>
          </div>
        )}

        {/* Joined Date */}
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span>
            Joined on {format(new Date(_creationTime), "MMM dd, yyyy")}
          </span>
        </div>

        {/* Last Updated */}
        {updatedAt && (
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>
              Last updated on {format(new Date(updatedAt), "MMM dd, yyyy")}
            </span>
          </div>
        )}

        {/* Followers and Following */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Followers:</span>
            <span>{followers?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Following:</span>
            <span>{following?.length || 0}</span>
          </div>
        </div>

        {/* Liked and Saved Blogs */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Liked Blogs:</span>
            <span>{likedBlogs?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Saved Blogs:</span>
            <span>{savedBlogs?.length || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorProfileCard;
