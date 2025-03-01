'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Camera, User } from "lucide-react";
import { AppSidebarStudent } from '@/app/components/app-sidebar-student';
import { SidebarProvider } from '@/components/ui/sidebar';

const StudentProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Doe',
    role: 'Student',
  });

  return (
    <SidebarProvider>
      <div className="flex item-center justify-center min-h-screen w-full">
        <AppSidebarStudent />
        <main className="flex-1 p-8 flex justify-center items-center">
          <Tabs defaultValue="profile" className="w-full max-w-2xl">
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-500" />
                        </div>
                        <Button size="sm" className="absolute bottom-0 right-0 rounded-full">
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-medium">Profile Picture</h4>
                        <p className="text-sm text-gray-500">Update your profile picture</p>
                      </div>
                    </div>

                    {/* Personal Information Form */}
                    <div className="grid gap-4 md:grid-cols-2 max-w-xl mx-auto">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          value={userInfo.firstName}
                          onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input 
                          id="middleName"
                          value={userInfo.middleName}
                          onChange={(e) => setUserInfo({...userInfo, middleName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          value={userInfo.lastName}
                          onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input 
                          id="role"
                          value={userInfo.role}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <div className="flex justify-center">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentProfile;