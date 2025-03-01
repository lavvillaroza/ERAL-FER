"use client";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <></>; // Prevent hydration errors

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Unauthorized Access</h1>
            <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
    );
}
