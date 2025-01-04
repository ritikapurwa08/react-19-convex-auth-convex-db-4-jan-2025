// components/floating-nav-bar.tsx
"use client";

import { HomeIcon, BookOpenIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const FloatingNavBar = () => {
  const location = useLocation();

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      name: "Blogs",
      path: "/blogs",
      icon: <BookOpenIcon className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/user-profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/4 transform -translate-x-1/4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg p-2 z-50">
      <div className="flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "p-2 rounded-full hover:bg-gray-100 transition-colors",
              location.pathname === link.path && "bg-gray-100"
            )}
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FloatingNavBar;
