"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookmarkIcon, HeartIcon, MenuIcon } from "lucide-react";
import React, { useState } from "react";

import { Hint } from "@/components/ui/hint";
import BlogFormCreate from "@/components/blogs/components/blog-form-create";
import BlogSearchInput from "@/components/blogs/components/blog-search-input";
import { Link } from "react-router-dom";
import UserButton from "@/components/auth/components/user-button";

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogsLayout = ({ children }: BlogLayoutProps) => {
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
          <Button
            id="filter-button"
            className={cn("w-full", isSidebarOpen ? "block" : "hidden")}
          >
            Filter
          </Button>
          <Hint side="right" label="Liked Blogs">
            <Button
              size={isSidebarOpen ? "default" : "icon"}
              asChild
              variant="outline"
              type="button"
              className={cn("w-full", isSidebarOpen ? "w-full" : "")}
            >
              <Link to="/blogs/liked">
                {isSidebarOpen ? (
                  <span className="flex flex-row items-center justify-center gap-x-2">
                    <HeartIcon />
                    Liked
                  </span>
                ) : (
                  <span>
                    <HeartIcon />
                  </span>
                )}
              </Link>
            </Button>
          </Hint>
          <Hint side="right" label="Saved Blogs">
            <Button
              size={isSidebarOpen ? "default" : "icon"}
              asChild
              variant="outline"
              type="button"
              className={cn("w-full", isSidebarOpen ? "w-full" : "")}
            >
              <Link to="/blogs/saved">
                {isSidebarOpen ? (
                  <span className="flex flex-row items-center justify-center gap-x-2">
                    <BookmarkIcon />
                    Saved
                  </span>
                ) : (
                  <span>
                    <BookmarkIcon />
                  </span>
                )}
              </Link>
            </Button>
          </Hint>
        </div>
        <div
          id="user-button-div"
          className={cn(
            "flex pb-3",
            isSidebarOpen ? "justify-start pl-2" : "justify-center"
          )}
        >
          <UserButton />
        </div>
      </aside>

      <div
        id="blog-list"
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSidebarOpen
            ? "md:col-span-3 lg:col-span-3 xl:col-span-4"
            : "md:col-span-3 lg:col-span-4 xl:col-span-5"
        )}
      >
        {children}
      </div>
    </main>
  );
};

export default BlogsLayout;
