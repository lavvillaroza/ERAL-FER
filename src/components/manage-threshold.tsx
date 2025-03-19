"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserModel } from "@/models/userModel";
import { getUserThresholdByUserId, updateUserThresholdByUserId } from "@/services/userAppService";
import { toast } from "sonner";
import { UserTeacherThresholdModel } from "@/models/userTeacherThresholdModel";
import { Textarea } from '@/components/ui/textarea';
import Loading from "@/components/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManageThresholdProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserModel;
}

const ManageThreshold: React.FC<ManageThresholdProps> = ({ isOpen, onClose, user }) => {
  const [userInfo, setUserInfo] = useState<UserModel | undefined>(user);  
  const [userThresholdSad, setUserThresholdSad] = useState<UserTeacherThresholdModel>({} as UserTeacherThresholdModel);
  const [userThresholdAngry, setUserThresholdAngry] = useState<UserTeacherThresholdModel>({} as UserTeacherThresholdModel);
  const [userThresholdFearful, setUserThresholdFearful] = useState<UserTeacherThresholdModel>({} as UserTeacherThresholdModel);
  const [userThresholdDisgusted, setUserThresholdDisgusted] = useState<UserTeacherThresholdModel>({} as UserTeacherThresholdModel);
  const [userThresholdNA, setUserThresholdNA] = useState<UserTeacherThresholdModel>({} as UserTeacherThresholdModel);
  // Sync user prop with state
  useEffect(() => {
    if (user) {
      setUserInfo(user);
      if (user.role != "teacher") return;
      
       const fetchUserTeacherThresholds = async () => {
            try {                       
              const userThresholdData = await getUserThresholdByUserId(user.userDetails.user_id);
              if (!userThresholdData.success) {
                throw new Error(userThresholdData.message);
              }      
              userThresholdData.data.map((val: UserTeacherThresholdModel) => {
                switch (val.expression_type) {
                  case "sad":
                    setUserThresholdSad(val);
                  case "angry":
                    setUserThresholdAngry(val);
                  case "disgusted":
                    setUserThresholdDisgusted(val);
                  case "fearful":
                    setUserThresholdFearful(val);
                  case "na":
                    setUserThresholdNA(val);
                }
              });              
            } catch (error) {
              console.log("Error fetching threshold data:", error);
              toast.error("Failed to fetch threshold data!", {
                description: error instanceof Error ? error.message : JSON.stringify(error),
              });
            }            
          }      
          fetchUserTeacherThresholds();
    }
  }, [user]);

  const handleSadSave = async () => {    
    try {        
        if (userInfo?.user_id !== undefined) {
          const response = await updateUserThresholdByUserId(userInfo.user_id, userThresholdSad);
          if(!response.success) {
            throw new Error(response.message);
          }
          
          console.log(response.message);

          toast.success("Updating User threshold for sad!", {
            description: "User threshold for sad has been saved successfully.",
          });
        } else {
            throw new Error("UserId is undefined");
        }        
    }
    catch (error) {
        console.error(error);
        toast.error("Failed to save threshold for sad!", {
            description: error instanceof Error ? error.message : JSON.stringify(error),
          });
    }    
  }

const handleSadInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;

  setUserThresholdSad((prev) => ({
      ...prev,
      [id === "sad-threshold" ? "threshold" : "message"]: id === "sad-threshold" ? Number(value) : value,
  }));
};  

const handleAngrySave = async () => {
  try {        
      if (userInfo?.user_id !== undefined) {
        const response = await updateUserThresholdByUserId(userInfo.user_id, userThresholdAngry);
        if(!response.success) {
          throw new Error(response.message);
        }
        toast.success("Updating User threshold for angry!", {
          description: "User threshold for angry has been saved successfully.",
        });

      } else {
          throw new Error("UserId is undefined");
      }        
  }
  catch (error) {
      console.error(error);
      toast.error("Failed to save threshold for angry!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
  }    
}

const handleAngryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;

  setUserThresholdAngry((prev) => ({
      ...prev,
      [id === "angry-threshold" ? "threshold" : "message"]: id === "angry-threshold" ? Number(value) : value,
  }));
};  

const handleFearfulSave = async () => {
  try {        
      if (userInfo?.user_id !== undefined) {
        const response = await updateUserThresholdByUserId(userInfo.user_id, userThresholdFearful);
        if(!response.success) {
          throw new Error(response.message);
        }
        toast.success("Updating User threshold for fearful!", {
          description: "User threshold for fearful has been saved successfully.",
        });

      } else {
          throw new Error("UserId is undefined");
      }        
  }
  catch (error) {
      console.error(error);
      toast.error("Failed to save threshold for fearful!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
  }    
}

const handleFearfulInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;

  setUserThresholdFearful((prev) => ({
      ...prev,
      [id === "fearful-threshold" ? "threshold" : "message"]: id === "fearful-threshold" ? Number(value) : value,
  }));
};  


const handleDisgustedSave = async () => {
  try {        
      if (userInfo?.user_id !== undefined) {
        const response = await updateUserThresholdByUserId(userInfo.user_id, userThresholdDisgusted);
        if(!response.success) {
          throw new Error(response.message);
        }
        toast.success("Updating User threshold for disgusted!", {
          description: "User threshold for disgusted has been saved successfully.",
        });

      } else {
          throw new Error("UserId is undefined");
      }        
  }
  catch (error) {
      console.error(error);
      toast.error("Failed to save threshold for disgusted!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
  }    
}

const handleDisgustedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;

  setUserThresholdDisgusted((prev) => ({
      ...prev,
      [id === "disgusted-threshold" ? "threshold" : "message"]: id === "disgusted-threshold" ? Number(value) : value,
  }));
};  


const handleNASave = async () => {
  try {        
      if (userInfo?.user_id !== undefined) {
        const response = await updateUserThresholdByUserId(userInfo.user_id, userThresholdDisgusted);
        if(!response.success) {
          throw new Error(response.message);
        }
        toast.success("Updating User threshold for NA!", {
          description: "User threshold for NA has been saved successfully.",
        });

      } else {
          throw new Error("UserId is undefined");
      }        
  }
  catch (error) {
      console.error(error);
      toast.error("Failed to save threshold for NA!", {
          description: error instanceof Error ? error.message : JSON.stringify(error),
        });
  }    
}

const handleNAInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { id, value } = e.target;

  setUserThresholdNA((prev) => ({
        ...prev,
        [id === "na-threshold" ? "threshold" : "message"]: id === "na-threshold" ? Number(value) : value,
    }));
  };  


  if (!user) {
    return <Loading/>; // Or a spinner
  }
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage User Threshold</DialogTitle>
          <DialogDescription>Select Tab.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full max-w-2xl">
          <div className="flex justify-start mb-4">
            <TabsList>
              <TabsTrigger value="Sad">Sad</TabsTrigger>
              <TabsTrigger value="Angry">Angry</TabsTrigger>
              <TabsTrigger value="Fearful">Fearful</TabsTrigger>
              <TabsTrigger value="Disgusted">Disgusted</TabsTrigger>
              <TabsTrigger value="NA">NA</TabsTrigger>
            </TabsList>
          </div>
          {/* Sad Threshold Tab */}
          <TabsContent value="Sad">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Sad Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">                  
                  {/* Sad Form */}
                  <div className="grid gap-4 md:grid-cols-1 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor={`sad-message`}>Message</Label>
                        <Textarea
                          id={`sad-message`}
                          placeholder="Topic description"
                          className="text-sm"
                          rows={2}
                          value={userThresholdSad.message}
                          onChange={handleSadInputChange}
                          required/>                        
                    </div>   
                    <div className="space-y-2">
                        <Label htmlFor={`sad-threshold`}>Expression</Label>
                        <Input
                          id={`sad-threshold`}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="threshold"
                          className="mb-1"
                          value={userThresholdSad.threshold}
                          onChange={handleSadInputChange}
                          required />
                    </div>                 
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSadSave}>
                        Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>          
          {/* Angry Threshold Tab */}
          <TabsContent value="Angry">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Angry Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">                  
                  {/* Sad Form */}
                  <div className="grid gap-4 md:grid-cols-1 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor={`angry-message`}>Message</Label>
                        <Textarea
                          id={`angry-message`}
                          placeholder="Topic description"
                          className="text-sm"
                          rows={2}
                          value={userThresholdAngry.message}
                          onChange={handleAngryInputChange}
                          required/>                        
                    </div>   
                    <div className="space-y-2">
                        <Label htmlFor={`angry-threshold`}>Expression</Label>
                        <Input
                          id={`angry-threshold`}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="threshold"
                          className="mb-1"
                          value={userThresholdAngry.threshold}
                          onChange={handleAngryInputChange}
                          required />
                    </div>                 
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAngrySave}>
                        Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>          
          {/* Fearful Threshold Tab */}
          <TabsContent value="Fearful">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Fearful Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">                  
                  {/* Sad Form */}
                  <div className="grid gap-4 md:grid-cols-1 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor={`fearful-message`}>Message</Label>
                        <Textarea
                          id={`fearful-message`}
                          placeholder="message"
                          className="text-sm"
                          rows={2}
                          value={userThresholdFearful.message}
                          onChange={handleFearfulInputChange}
                          required/>                        
                    </div>   
                    <div className="space-y-2">
                        <Label htmlFor={`fearful-threshold`}>Expression</Label>
                        <Input
                          id={`fearful-threshold`}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="threshold"
                          className="mb-1"
                          value={userThresholdFearful.threshold}
                          onChange={handleFearfulInputChange}
                          required />
                    </div>                 
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleFearfulSave}>
                        Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Disgusted Threshold Tab */}
          <TabsContent value="Disgusted">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Disgusted Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">                  
                  {/* Sad Form */}
                  <div className="grid gap-4 md:grid-cols-1 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor={`disgusted-message`}>Message</Label>
                        <Textarea
                          id={`disgusted-message`}
                          placeholder="message"
                          className="text-sm"
                          rows={2}
                          value={userThresholdDisgusted.message}
                          onChange={handleDisgustedInputChange}
                          required/>                        
                    </div>   
                    <div className="space-y-2">
                        <Label htmlFor={`fearful-threshold`}>Expression</Label>
                        <Input
                          id={`fearful-threshold`}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="threshold"
                          className="mb-1"
                          value={userThresholdDisgusted.threshold}
                          onChange={handleDisgustedInputChange}
                          required />
                    </div>                 
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleDisgustedSave}>
                        Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* NA Threshold Tab */}
          <TabsContent value="NA">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No FER Threshold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">                  
                  {/* Sad Form */}
                  <div className="grid gap-4 md:grid-cols-1 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor={`na-message`}>Message</Label>
                        <Textarea
                          id={`na-message`}
                          placeholder="message"
                          className="text-sm"
                          rows={2}
                          value={userThresholdNA.message}
                          onChange={handleNAInputChange}
                          required/>                        
                    </div>   
                    <div className="space-y-2">
                        <Label htmlFor={`na-threshold`}>Expression</Label>
                        <Input
                          id={`na-threshold`}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="threshold"
                          className="mb-1"
                          value={userThresholdNA.threshold}
                          onChange={handleNAInputChange}
                          required />
                    </div>                 
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleNASave}>
                        Save Changes
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

export default ManageThreshold;
