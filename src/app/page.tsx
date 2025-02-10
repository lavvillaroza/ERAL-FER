'use client';

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to shadcn/ui with Next.js</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This is an example component using shadcn/ui and Tailwind CSS.</p>
          <Button className="mt-4" variant="default">
            Click Me
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
