import { Id } from "@convex/_generated/dataModel";

interface UserSmallCardProps {
  name: string;
  userName: string;
  customProfilePicture: string;
  userId: Id<"users">;
}

const UserCardSmall: React.FC<UserSmallCardProps> = ({
  name,
  userName,
  customProfilePicture,
  userId,
}) => {
  return (
    <div
      key={userId}
      className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      {/* Profile Picture */}
      <img
        src={customProfilePicture || "https://via.placeholder.com/40"}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
      />

      {/* User Details */}
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
        <p className="text-xs text-gray-500">@{userName}</p>
      </div>

      {/* Follow Button (Optional) */}
      <button className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200">
        Follow
      </button>
    </div>
  );
};

export default UserCardSmall;
