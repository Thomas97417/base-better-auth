import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

export const useLogout = () => {
  const router = useRouter();

  return async () => {
    await authClient.signOut();
    router.push("/");
  };
};
