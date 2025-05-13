"use client";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export default function PasswordChangeButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="hover:cursor-pointer group hover:text-primary hover:bg-primary/10 hover:border-primary/20"
      onClick={() => router.push("/profile/password")}
    >
      <KeyRound className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
      Change Password
    </Button>
  );
}
