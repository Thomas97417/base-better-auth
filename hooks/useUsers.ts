import { authClient } from "@/lib/auth-client";
import { PAGE_SIZE } from "@/utils/constants";
import { UserType } from "@/utils/types/UserType";
import useSWR from "swr";

interface UsersResponse {
  users: UserType[];
  totalPages: number;
  totalUsers: number;
  currentPage: number;
}

interface UsersFilters {
  search?: string;
  showBannedOnly?: boolean;
  showAdminsOnly?: boolean;
  fetchAll?: boolean;
}

const fetcher = async ([key, filters]: [
  string,
  UsersFilters
]): Promise<UsersResponse> => {
  // key format: users-{page}
  const page = parseInt(key.split("-")[1] || "1", 10);
  const searchValue = filters.search?.toLowerCase();

  // Fetch all users when searching to enable client-side search
  const response = await authClient.admin.listUsers({
    query: {
      limit: searchValue ? undefined : filters.fetchAll ? undefined : PAGE_SIZE,
      offset: searchValue
        ? undefined
        : filters.fetchAll
        ? undefined
        : (page - 1) * PAGE_SIZE,
      filterField: filters.showBannedOnly
        ? "banned"
        : filters.showAdminsOnly
        ? "role"
        : undefined,
      filterValue: filters.showBannedOnly
        ? "true"
        : filters.showAdminsOnly
        ? "admin"
        : undefined,
    },
  });

  if (!response?.data) {
    throw new Error("Failed to fetch users");
  }

  let users = response.data.users.map((user) => ({
    ...user,
    fullName: user.name,
  })) as UserType[];

  // If there's a search term, filter users client-side
  if (searchValue) {
    users = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
  }

  // Apply pagination to filtered results
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  if (!searchValue && !filters.fetchAll) {
    return {
      users,
      totalPages: Math.ceil(response.data.total / PAGE_SIZE),
      totalUsers: response.data.total,
      currentPage: page,
    };
  }

  // For search results or fetchAll, paginate manually
  const start = (page - 1) * PAGE_SIZE;
  const paginatedUsers = users.slice(start, start + PAGE_SIZE);

  return {
    users: paginatedUsers,
    totalPages,
    totalUsers,
    currentPage: page,
  };
};

export function useUsers(page: number = 1, filters: UsersFilters = {}) {
  const { data, error, isLoading, mutate } = useSWR<UsersResponse, Error>(
    [`users-${filters.fetchAll ? "all" : page}`, filters],
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      keepPreviousData: true,
    }
  );

  return {
    users: data?.users || [],
    totalPages: data?.totalPages || 0,
    totalUsers: data?.totalUsers || 0,
    currentPage: data?.currentPage || page,
    isLoading,
    error,
    mutate,
  };
}
