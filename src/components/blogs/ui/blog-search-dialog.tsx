import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { SearchIcon, XCircle } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { Hint } from "@/components/ui/hint";
import useSearchBlogWithPagination from "../../../hooks/blogs/query/search-blogs-paginations-hook";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const BlogSearchInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const {
    searchTerm,
    setSearchTerm,
    paginatedResults,
    currentPage,
    totalPages,
    handlePageChange,
    isLoading,
    totalResults,
  } = useSearchBlogWithPagination();

  const handleNavigate = (blogId: string) => {
    navigate(`/blogs/${blogId}`); // Assuming your blog route is /blogs/:id
    setIsOpen(false);
    setSearchTerm(""); // Clear the search term after navigation
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm(""); // Clear search on close
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <SearchIcon className="absolute size-3.5 top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground" />
          <Input
            placeholder="Search Blogs"
            className="pl-10 pr-4 py-3 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-xl sm:max-w-3xl bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        <DialogHeader className="sticky top-0 z-10 bg-inherit px-1 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <SearchIcon className="h-6 w-6" />
            Search Blogs
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by title or content..."
            className="pl-10 pr-4 py-3 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!isLoading && totalResults === 0 && searchTerm && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No blogs found matching your search.
            </p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && paginatedResults.length > 0 && (
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {paginatedResults.map((blog) => (
              <div
                key={blog._id}
                onClick={() => handleNavigate(blog._id)}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <img
                  src={blog.convexStorageUrl}
                  alt={blog.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{blog.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {blog.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-6">
            <DialogFooter>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      variant="outline"
                      size="icon"
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "hover:bg-primary hover:text-white",
                        currentPage === page ? "bg-primary text-white" : ""
                      )}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
            </DialogFooter>
          </div>
        )}

        {/* Close Button */}
        <Hint label="close" side="right">
          <Button
            variant="outline"
            className="absolute z-10 top-4 right-4"
            size="icon"
            onClick={handleClose}
          >
            <XCircle className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </Hint>
      </DialogContent>
    </Dialog>
  );
};

export default BlogSearchInput;
