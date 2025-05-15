import ResetPasswordCard from "@/components/cards/ResetPasswordCard";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <div className="w-full max-w-md mx-auto my-auto">
      <Suspense>
        <ResetPasswordCard />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
