"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/utils/types/UserType";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Shield,
  UserRound,
} from "lucide-react";

interface UserActionsProps {
  user: UserType;
  onViewDetails: (userId: string) => void;
  onRoleChange: (user: UserType) => void;
  onBanAction: (user: UserType) => void;
}

export default function UserActions({
  user,
  onViewDetails,
  onRoleChange,
  onBanAction,
}: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          User Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onViewDetails(user.id)}
          className="cursor-pointer group"
        >
          <Eye className="mr-2 h-4 w-4 group-hover:text-blue-600" />
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onRoleChange(user)}
          className={`cursor-pointer flex items-center group`}
        >
          <Shield className="mr-2 h-4 w-4 group-hover:text-blue-600" />
          {user.role === "admin" ? "Remove admin rights" : "Make admin"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onBanAction(user)}
          className={`cursor-pointer flex items-center group `}
        >
          {user.banned ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 group-hover:text-green-600" />
              Unban user
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-4 w-4 group-hover:text-red-600" />
              Ban user
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
