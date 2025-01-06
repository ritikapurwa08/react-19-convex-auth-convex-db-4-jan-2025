// components/user-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "@convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"; // Import date-fns
type User = Doc<"users">;

export const userColumns: ColumnDef<User>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      return <p className="text-14-medium">{user.name}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return <p className="text-14-regular">{user.email}</p>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      return <p className="text-14-regular">{user.name}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <p className="text-14-regular">
          {format(new Date(user._creationTime), "MMM dd, yyyy h:mm a")}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit user:", user._id)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log("Delete user:", user._id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
