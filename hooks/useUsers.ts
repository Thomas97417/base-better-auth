import { authClient } from "@/lib/auth-client";
import { UserType } from "@/utils/types/UserType";
import useSWR from "swr";

const fetcher = async () => {
  const response = await authClient.admin.listUsers({
    query: { limit: 10 },
  });

  if (!response?.data) {
    throw new Error("Failed to fetch users");
  }

  // Transformer les données pour correspondre à UserType
  return response.data.users.map((user) => ({
    ...user,
    fullName: user.name,
  })) as UserType[];
};

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<UserType[], Error>(
    "users",
    fetcher,
    {
      revalidateOnFocus: false, // Désactiver la revalidation au focus
      dedupingInterval: 10000, // Dédupliquer les requêtes pendant 10 secondes
    }
  );

  return {
    users: data,
    isLoading,
    error,
    mutate, // Pour recharger manuellement les données si nécessaire
  };
}
