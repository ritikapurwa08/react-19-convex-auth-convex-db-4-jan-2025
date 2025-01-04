"use client";

import { useState } from "react";
import BlogFormCreate from "./blog-form-create";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BlogSearchInput from "./blog-search-input";
import { BookmarkIcon, HeartIcon, MenuIcon, TestTubeIcon } from "lucide-react";
import UserButton from "@/components/auth/components/user-button";
import { Hint } from "@/components/ui/hint";
import { Link, Outlet } from "react-router-dom";

const BlogLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpenSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <main className="container flex flex-row mx-auto px-4 gap-x-6 max-w-7xl">
      {/* Sidebar */}
      <aside
        className={cn(
          "space-y-4 sticky top-0 h-screen min-h-screen transition-all duration-300 ease-in-out border-r border-2 border-gray-200 flex flex-col",
          isSidebarOpen ? "w-80" : "w-16"
        )}
      >
        <div
          id="sidebar-options"
          className={cn(
            "flex flex-col flex-1 py-4 items-center justify-start space-y-4",
            isSidebarOpen ? "px-4" : "px-2"
          )}
        >
          <div>
            <Button type="button" size="icon" onClick={handleOpenSidebar}>
              <MenuIcon />
            </Button>
          </div>
          <BlogFormCreate minWidth={!isSidebarOpen} />
          <BlogSearchInput />
          {/* liked blogs route with sm icon  */}
          <Hint label="Liked Blogs" side="right">
            <Button asChild variant="outline" size="icon">
              <Link to="/blogs/liked">
                <HeartIcon className="" />
              </Link>
            </Button>
          </Hint>
          {/* saved blogs route with sm icon  */}
          <Hint label="Saved Blogs" side="right">
            <Button asChild variant="outline" size="icon">
              <Link to="/blogs/saved">
                <BookmarkIcon className="" />
              </Link>
            </Button>
          </Hint>
          {/* test blogs route  */}
          <Hint label="Test Blogs" side="right">
            <Button asChild variant="outline" size="icon">
              <Link to="/blogs/test">
                <TestTubeIcon className="" />
              </Link>
            </Button>
          </Hint>
          <Button
            id="filter-button"
            className={cn("w-full", isSidebarOpen ? "block" : "hidden")}
          >
            Filter
          </Button>
        </div>
        <div
          id="user-button-div"
          className={cn(
            "flex",
            isSidebarOpen ? "justify-start pl-2" : "justify-center"
          )}
        >
          <UserButton />
        </div>
      </aside>

      {/* Main content */}
      <div
        id="blog-list"
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen
            ? "md:col-span-3 lg:col-span-3 xl:col-span-4"
            : "md:col-span-3 lg:col-span-4 xl:col-span-5"
        )}
      >
        <Outlet />
      </div>
    </main>
  );
};

export default BlogLayout;
