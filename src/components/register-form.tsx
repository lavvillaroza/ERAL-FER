'use client'
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterForm() {
  const [role, setRole] = React.useState("");

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" placeholder="John" required />
        </div>

        <div className="">
          <Label htmlFor="middle-name">Middle Name</Label>
          <Input id="middle-name" placeholder="William" />
        </div>

        <div className="">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Doe" required />
        </div>

        <div className="">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "student" && (
          <div className="">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              placeholder="Enter your course"
              required
            />
          </div>
        )}

        <div className="">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="me@example.com" required />
        </div>

        <div className="">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>

        <div className="">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" required />
        </div>

        <Button className="w-full">Register</Button>
        <h1 className="text-center text-sm font-light">
          Already have an account?{" "}
          <a href="/login" className="underline">Login Here</a>
        </h1>
      </CardContent>
    </Card>
  );
}