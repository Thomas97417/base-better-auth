"use client";

import UserBanDialog from "@/components/admin/dialogs/UserBanDialog";
import UserRoleDialog from "@/components/admin/dialogs/UserRoleDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { UserType } from "@/utils/types/UserType";
import { ChevronLeft, ChevronRight, Shield, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormError from "../forms/FormError";
import UsersDataTable from "./UsersDataTable";

export default function ListUsers() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showBannedOnly, setShowBannedOnly] = useState(false);
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, showBannedOnly, showAdminsOnly]);

  const { users, totalPages, error, mutate } = useUsers(currentPage, {
    search: search || undefined,
    showBannedOnly,
    showAdminsOnly,
  });

  const handleViewDetails = (userId: string) => {
    router.push(`/admin/${userId}`);
  };

  const handleUserBan = (user: UserType) => {
    setSelectedUser(user);
    setIsBanDialogOpen(true);
  };

  const handleUserRole = (user: UserType) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  // Reset other filter when one is selected
  const handleFilterChange = (filterType: "banned" | "admin") => {
    if (filterType === "banned") {
      setShowBannedOnly(!showBannedOnly);
      setShowAdminsOnly(false);
    } else {
      setShowAdminsOnly(!showAdminsOnly);
      setShowBannedOnly(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show at least one page
    if (totalPages <= 0) {
      return [1];
    }

    // If there are 7 or fewer pages, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Otherwise, show first page, last page, and pages around current page
    const firstPage = 1;
    const lastPage = totalPages;

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "ellipsis", lastPage];
    }

    if (currentPage >= totalPages - 2) {
      return [
        firstPage,
        "ellipsis",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      firstPage,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      lastPage,
    ];
  };

  if (error) {
    return <FormError message={error.message} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search users..."
          className="md:max-w-sm max-w-full border-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            variant={showAdminsOnly ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("admin")}
            className={`slg:w-[180px] justify-center items-center slg:justify-start gap-1 hover:cursor-pointer ${
              !showAdminsOnly &&
              "hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
            }`}
          >
            <Shield
              className={cn("h-4 w-4 slg:mr-2", showAdminsOnly && "text-white")}
            />
            <span className="hidden slg:block">
              {showAdminsOnly ? "Admin Users" : "View Admin Users"}
            </span>
          </Button>

          <Button
            variant={showBannedOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("banned")}
            className={`slg:w-[180px] justify-center items-center slg:justify-start gap-1 hover:cursor-pointer ${
              !showBannedOnly &&
              "hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
            }`}
          >
            <UserX
              className={cn("h-4 w-4 slg:mr-2", showBannedOnly && "text-white")}
            />
            <span className="hidden slg:block">
              {showBannedOnly ? "Banned Users" : "View Banned Users"}
            </span>
          </Button>
        </div>
      </div>

      {/* Users table with loading state */}
      <div>
        <UsersDataTable
          users={users || []}
          onViewDetails={handleViewDetails}
          onRoleChange={handleUserRole}
          onBanAction={handleUserBan}
        />
      </div>

      {/* Pagination */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
              className={cn(
                "gap-1 px-2 h-8 text-sm hover:cursor-pointer",
                currentPage === 1 && "opacity-50"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
          </PaginationItem>

          <div className="flex items-center gap-1 mx-2">
            {generatePagination().map((page, i) => (
              <PaginationItem key={i}>
                {page === "ellipsis" ? (
                  <div className="px-2 py-1">
                    <PaginationEllipsis />
                  </div>
                ) : (
                  <Button
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(Number(page))}
                    className={cn(
                      "h-8 w-8 p-0 text-sm hover:cursor-pointer",
                      page === currentPage && "font-medium"
                    )}
                  >
                    {page}
                  </Button>
                )}
              </PaginationItem>
            ))}
          </div>

          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentPage < totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages}
              className={cn(
                "gap-1 px-2 h-8 text-sm hover:cursor-pointer",
                currentPage === totalPages && "opacity-50"
              )}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <UserBanDialog
        isOpen={isBanDialogOpen}
        onClose={() => setIsBanDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />
      <UserRoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
