// --- START OF FILE src/app/login/page.tsx ---
"use client";

import { loginUser } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    const result = await loginUser(formData);
    
    if (result.success) {
      toast.success("Logged in successfully");
      router.push("/");
      router.refresh(); // Refresh to update server components like Navbar
    } else {
      toast.error(result.error as string);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Login to Socially</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}