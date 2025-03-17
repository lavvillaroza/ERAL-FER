"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserModel } from "@/models/userModel";
import { UserRole } from "@/types/userRole";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GetFullName, GetIntialName } from "@/lib/fullName";
import { updateUserDetailsByUserId, updateUserPasswordByUserId } from "@/services/userAppService";
import { toast } from "sonner";
import { changePasswordDto } from "@/dto/changePassword.dto";
import { ChangePasswordModel } from "@/models/changePasswordModel";

interface ManageAccountProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserModel;
}

const ManageAccount: React.FC<ManageAccountProps> = ({ isOpen, onClose, user }) => {
  const [userInfo, setUserInfo] = useState<UserModel | undefined>(user);
  const [profileImage, setProfileImage] = useState<string  | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  // Sync user prop with state
  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const handleSave = async () => {
    try {        
        if (userInfo?.user_id !== undefined) {
          const response = await updateUserDetailsByUserId(userInfo.user_id, userInfo);
          if(!response.success) {
            throw new Error(response.message);
          }
          toast.success("Updating User details!", {
            description: "User details has been saved successfully.",
          });

        } else {
            throw new Error("UserId is undefined");
        }        
    }
    catch (error) {
        console.error(error);
        toast.error("Failed to save user details!", {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          });
    }
  }

  const handleChangePassword = async () => {
    // Create an instance of ChangePasswordModel
    const passwordData: ChangePasswordModel = {
        currentPassword,
        newPassword,
        confirmPassword,
        };

        // Validate with Zod
    const result = changePasswordDto.safeParse(passwordData);

    if (!result.success) {
      // Format validation errors
      const formattedErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {        
        if (userInfo?.user_id !== undefined) {
          const response = await updateUserPasswordByUserId(userInfo.user_id, currentPassword, newPassword);
          if(!response.success) {
            throw new Error(response.message);
          }
          toast.success("Updating User details!", {
            description: "User details has been saved successfully.",
          });

        } else {
            throw new Error("UserId is undefined");
        }                      
         setCurrentPassword("");
         setNewPassword("");
         setConfirmPassword("");
    }
    catch (error) {
        console.error(error);
        toast.error("Failed to save user details!", {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          });
    }
    finally {
        // Clear errors and process the password change logic
        setErrors({});
    }
  }

  // Handle Image Upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const arrayBuffer = await file.arrayBuffer(); // Convert file to ArrayBuffer
        const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer         
        setProfileImage(URL.createObjectURL(file)); // Set temporary preview
        // Update userInfo state to reflect the change
        setUserInfo((prev) =>
        prev    
            ? {
                ...prev,
                userDetails: {
                ...prev.userDetails,
                profile_image: buffer, // Temporary preview
                },
            }
            : prev
        );
    }
  };
  if (!user) {
    return <div>Loading...</div>; // Or a spinner
  }
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage User Account</DialogTitle>
          <DialogDescription>Select Tab.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full max-w-2xl">
          <div className="flex justify-start mb-4">
            <TabsList>
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Information Tab */}
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
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <Avatar className="w-full h-full object-cover">
                            <AvatarImage 
                                src={profileImage ? profileImage : user.userDetails?.profile_image?.toString() ?? "/images/user.png"}
                                alt={GetFullName(user.userDetails)} 
                            />
                            <AvatarFallback className="rounded-lg">{GetIntialName(user.userDetails)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <label htmlFor="profile-upload">
                        <Button size="sm" className="absolute bottom-0 right-0 rounded-full cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default button behavior
                                document.getElementById("profile-upload")?.click(); // Trigger file input click
                            }}>
                          <Camera className="w-4 h-4" />
                        </Button>
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-medium">Profile Picture</h4>
                      <p className="text-sm text-gray-500">Update your profile picture</p>
                    </div>
                  </div>

                  {/* Personal Information Form */}
                  <div className="grid gap-4 md:grid-cols-1 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={userInfo?.userDetails?.first_name || ""}
                        onChange={(e) =>
                          setUserInfo((prev) =>
                            prev
                              ? { ...prev, userDetails: { ...prev.userDetails, first_name: e.target.value } }
                              : prev
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middle_name">Middle Name</Label>
                      <Input
                        id="middle_name"
                        value={userInfo?.userDetails?.middle_name || ""}
                        onChange={(e) =>
                          setUserInfo((prev) =>
                            prev
                              ? { ...prev, userDetails: { ...prev.userDetails, middle_name: e.target.value } }
                              : prev
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={userInfo?.userDetails?.last_name || ""}
                        onChange={(e) =>
                          setUserInfo((prev) =>
                            prev
                              ? { ...prev, userDetails: { ...prev.userDetails, last_name: e.target.value } }
                              : prev
                          )
                        }
                      />
                    </div>
                    {userInfo?.role === UserRole.STUDENT && (
                      <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          value={userInfo?.userDetails?.course || ""}
                          onChange={(e) =>
                            setUserInfo((prev) =>
                              prev
                                ? { ...prev, userDetails: { ...prev.userDetails, course: e.target.value } }
                                : prev
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={userInfo?.role || ""} disabled className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}  />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  </div>                  
                  <div className="flex justify-end">
                    <Button onClick={handleChangePassword}>
                        Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAccount;
