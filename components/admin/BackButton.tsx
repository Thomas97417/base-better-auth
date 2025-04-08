"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function BackButton(props: { text: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="hover:cursor-pointer"
      onClick={() => router.push("/admin")}
    >
      {props.text}
    </Button>
  );
}
