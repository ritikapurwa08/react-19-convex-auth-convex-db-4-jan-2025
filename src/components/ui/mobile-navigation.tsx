"use client";

import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  HeartIcon, // For Liked Blogs
  BookmarkIcon, // For Saved Blogs
  UsersIcon, // For Author Profile
  SearchIcon, // For Search Profile
  LayoutDashboardIcon, // For Home Bottom
  ArrowDownToLineIcon, // For Home Footer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Hint } from "@/components/ui/hint";
import { cn } from "@/lib/utils";
import UserButton from "@/components/member/user/ui/user-dialog";

const navigation = [
  {
    name: "Home",
    icon: <HomeIcon className="h-5 w-5" />,
    path: [
      { name: "Home", path: "/", icon: <HomeIcon className="h-4 w-4" /> },
      {
        name: "Home Bottom",
        path: "/home-bottom",
        icon: <LayoutDashboardIcon className="h-4 w-4" />,
      },
      {
        name: "Home Footer",
        path: "/home-footer",
        icon: <ArrowDownToLineIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Blogs",
    icon: <BookOpenIcon className="h-5 w-5" />,
    path: [
      {
        name: "Blogs",
        path: "/blogs",
        icon: <BookOpenIcon className="h-4 w-4" />,
      },
      {
        name: "Liked",
        path: "/blogs/liked",
        icon: <HeartIcon className="h-4 w-4" />,
      },
      {
        name: "Saved",
        path: "/blogs/saved",
        icon: <BookmarkIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    name: "Profile",
    icon: <UserIcon className="h-5 w-5" />,
    path: [
      {
        name: "Profile",
        path: "/user-profile",
        icon: <UserIcon className="h-4 w-4" />,
      },
      {
        name: "Author Profile",
        path: "/profile/author",
        icon: <UsersIcon className="h-4 w-4" />,
      },
      {
        name: "Search Profile",
        path: "/profile/search",
        icon: <SearchIcon className="h-4 w-4" />,
      },
    ],
  },
];

const MobileNavigation = () => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();

  const handleTabClick = (tabName: string) => {
    setSelectedTab(selectedTab === tabName ? null : tabName);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;

      if (isScrollingDown && currentScrollPos > 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 w-full px-4 z-50"
        >
          {/* Container for centering */}
          <div className="mx-auto w-fit max-w-full">
            <div className="backdrop-blur-sm bg-white/80 border-gray-300 border-2 rounded-full shadow-md p-2 z-50">
              <div className="flex items-center justify-between">
                {/* Left Side: Dynamic Links (now with conditional rendering) */}
                <AnimatePresence>
                  {selectedTab && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center space-x-2"
                    >
                      {navigation
                        .find((tab) => tab.name === selectedTab)
                        ?.path.map((link) => (
                          <Hint key={link.name} side="top" label={link.name}>
                            <Link
                              to={link.path}
                              className={cn(
                                "p-2 rounded-full hover:bg-gray-100 transition-colors",
                                location.pathname === link.path && "bg-gray-100"
                              )}
                            >
                              {link.icon}
                            </Link>
                          </Hint>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Right Side: Main Tabs */}
                <div className="flex items-center space-x-2">
                  {navigation.map((tab) => (
                    <Hint key={tab.name} side="top" label={tab.name}>
                      <button
                        onClick={() => handleTabClick(tab.name)}
                        className={cn(
                          "p-2 rounded-full hover:bg-gray-100 transition-colors",
                          selectedTab === tab.name && "bg-gray-100"
                        )}
                      >
                        {tab.icon}
                      </button>
                    </Hint>
                  ))}
                  <div>
                    <UserButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
