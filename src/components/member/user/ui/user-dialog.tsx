"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, User } from "lucide-react"; // Import icons from lucide-react
import SignOutButton from "../../../auth/ui/log-out-button";
import { useNavigate } from "react-router-dom";
import { UseGetCurrentUserQueryHook } from "@/hooks/member/user/user-query-hooks";

const UserDialog = () => {
  const { user } = UseGetCurrentUserQueryHook();
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";
  const defaultProfileImage =
    "https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg";
  const navigate = useNavigate();
  const handleProfileNavigate = () => {
    console.log("Current user email:", user?.email); // Check this!
    if (user?.email) {
      navigate(`/member/user/user-profile`);
    }
  };

  return (
    <DropdownMenu>
      {/* Dropdown Trigger */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-8 rounded-full p-0"
          aria-label="User menu"
          type="button"
        >
          <Avatar className="size-6">
            <AvatarImage src={defaultProfileImage} alt={userName} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent className="w-56" align="end" side="right" forceMount>
        {/* User Details */}
        <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
          <p className="font-medium text-sm">{userName}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Profile */}
        <DropdownMenuItem
          onClick={() => handleProfileNavigate()}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDialog;
