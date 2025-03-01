"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, loginUser } from "@/services/authAppService";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 🔹 Call login API
            const data = await loginUser({ email, password });
            console.log("Login Response:", data);

            if (!data) throw new Error("Invalid email or password");

            if (data.status === 403) throw new Error(data.message);

            // ✅ After login, fetch the user role
            const roleData = await getUserRole();
            console.log("User Role Response:", roleData);

            if (!roleData || !roleData.user_role) throw new Error("Failed to fetch user role");

            // 🔀 Redirect based on role
            switch (roleData.user_role) {
                case "ADMIN":
                    router.push("/admin");
                    break;
                case "TEACHER":
                    router.push("/teacher");
                    break;
                case "STUDENT":
                    router.push("/student");
                    break;
                default:
                    router.push("/");
            }
        } catch (err) {
            setError(`${err}`);
        }
    };

    return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link  href="#" className="flex items-center gap-2 self-center font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                </div>
                ERAL-FER
            </Link >
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin}> 
                            <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                id="email"
                                type="email" 
                                placeholder="m@example.com"
                                value={email} onChange={(e) => setEmail(e.target.value)}                            
                                required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" 
                                type="password" placeholder="Password" 
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required />
                            </div>
                            <div className="flex justify-end">
                                <Link 
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </Link >
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link  href="/register" className="underline underline-offset-4">
                                    Sign up
                                </Link >
                            </div>
                        </form>
                    </CardContent>
                </Card>  
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By clicking continue, you agree to our <Link  href="#">Terms of Service</Link >{" "}
                    and <Link  href="#">Privacy Policy</Link >.
                </div>         
            </div>
        </div>
    </div>
    );
}
