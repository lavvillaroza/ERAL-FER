"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await AuthService.login(email, password);
            const data = await response.json(); // ✅ Extract JSON from response            
            // 🔀 Redirect based on role
            switch (data.role) {
                case "admin":
                    router.push("/admin/dashboard");
                    break;
                case "teacher":
                    router.push("/teacher/dashboard");
                    break;
                case "student":
                    router.push("/student/dashboard");
                    break;
                default:
                    router.push("/");
            }
        } catch (err) {
            setError("Invalid email or password" + err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="email" placeholder="Email" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="border p-2"
                />
                <input 
                    type="password" placeholder="Password" 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="border p-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}
