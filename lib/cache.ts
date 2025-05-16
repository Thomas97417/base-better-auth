import { UserType } from "@/utils/types/UserType";
import { revalidateTag, unstable_cache } from "next/cache";
import { getUser } from "./auth-session";

/**
 * Version mise en cache de getUser
 * - Invalidation via tag "user-data"
 */
export const getUserCache = unstable_cache(
  async (): Promise<UserType | undefined> => {
    return getUser();
  },
  ["user-data"],
  {
    tags: ["user-data"],
    revalidate: 60, // Revalider automatiquement après 60 secondes
  }
);

/**
 * Fonction pour forcer la revalidation du cache utilisateur
 * À appeler après toute modification du profil utilisateur
 */
export const revalidateUserCache = () => {
  revalidateTag("user-data");
};
