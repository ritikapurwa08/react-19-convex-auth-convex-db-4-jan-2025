import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

const useSearchBlogWithPagination = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all matching results initially
  const allResults = useQuery(api.blogs.searchBlogs, { searchTerm });

  // Calculate total number of pages
  const totalPages = allResults
    ? Math.ceil(allResults.length / ITEMS_PER_PAGE)
    : 0;

  // Get results for the current page
  const paginatedResults = allResults
    ? allResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : [];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search term change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to the first page on new search
  };

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    paginatedResults,
    currentPage,
    totalPages,
    handlePageChange,
    isLoading: !allResults, // Loading state while fetching all results
    totalResults: allResults ? allResults.length : 0, // Total number of matching results
  };
};

export default useSearchBlogWithPagination;
