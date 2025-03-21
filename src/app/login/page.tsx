"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authAppService";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (isLoading) return; // Prevent multiple clicks
        setIsLoading(true);

        try {
            // 🔹 Call login API
            const responseLogin = await loginUser({ email, password });            
            // 🔀 Redirect based on role
            switch (responseLogin.data.role) {
                case "admin":
                    router.push("/admin/class-management");
                    break;
                case "teacher":
                    router.push("/teacher/my-classes/current");
                    break;
                case "student":
                    router.push("/student/my-classes/current");
                    break;
                default:
                    router.push("/");
            }
        } catch (err) {
            setError(`${err}`);            
        }
        finally {
            setIsLoading(false);
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
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                    Forgot your password?
                                </Link >
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Logging in..." : "Login"}
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
