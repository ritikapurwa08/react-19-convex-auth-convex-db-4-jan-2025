// pages/users-page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { usePaginatedUsers } from "@/components/_userProfile/hooks/user-query-hooks";
import { userColumns } from "./user-column";

const UsersPage = () => {
  const { results, isLoading, hasMore, loadMore } = usePaginatedUsers();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable columns={userColumns} data={results} />

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => loadMore(5)} // Load 5 more users
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
