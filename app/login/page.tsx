import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl font-extrabold">MyApp</CardTitle>
            <CardDescription className="text-lg">
              A boilerplate for creating your ideas fast
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link
                  href="/login/sign-in"
                  className="flex items-center justify-center gap-2"
                >
                  Sign in to your account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/login/sign-up">Create new account</Link>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Experience secure authentication with modern features and a
              seamless user experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
