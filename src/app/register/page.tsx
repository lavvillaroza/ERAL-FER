"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/userRole";
import { registerUser } from "@/services/authAppService";
import { useEffect, useState } from "react";
import { RegisterUserDto } from "@/dto/user.dto";
import { GalleryVerticalEnd } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Register() {
  const [open, setOpen] = useState(false);
  const [clientRole, setClientRole] = useState("");  
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5); // 5-second timer
  const router = useRouter();
  
  const {
    register,
    handleSubmit,   
    setValue, // Add setValue to update the form state
    watch,
    formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(RegisterUserDto),
    defaultValues: { role: UserRole.STUDENT }, 
 });
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      console.log(data);
      await registerUser(data);
      setOpen(true);
    } catch (error) {
      setError("Registration failed: " + error);
    }
  };

  useEffect(() => {    
    const subscription = watch((value) => {
      if(value.role) {
        setClientRole(value.role);
      } else {
        setClientRole(UserRole.STUDENT);
      }
    }); // Watch role changes
    return () => subscription.unsubscribe(); // Cleanup subscription
  }, [watch]);

  // Automatically redirect after 5 seconds
  useEffect(() => {
    if (open) {
      setCountdown(5); // Reset timer
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Redirect after 5 seconds
      const timeout = setTimeout(() => {
        router.push("/login"); // Navigate to login
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [open, router]);

  // Redirect to login when the user closes the dialog
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/login");
    }
    setOpen(isOpen);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
            </div>
            ERAL-FER
        </a>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Register</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input {...register("first_name")} placeholder="John" />
                {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input {...register("middle_name")} placeholder="William" />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input {...register("last_name")} placeholder="Doe" />
                {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setValue("role", value as UserRole.STUDENT | UserRole.TEACHER)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.STUDENT}>{UserRole.STUDENT}</SelectItem>
                    <SelectItem value={UserRole.TEACHER}>{UserRole.TEACHER}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500">{errors.role.message}</p>}
              </div>

              {clientRole === UserRole.STUDENT && (
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Input {...register("course")} placeholder="Enter your course" />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} type="email" placeholder="me@example.com" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input {...register("password")} type="password" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input {...register("confirmPassword")} type="password" />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>
              
              {error && <p className="text-red-500">{error}</p>}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>

              <h1 className="text-center text-sm font-light">
                Already have an account? <a href="/login" className="underline">Login Here</a>
              </h1>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* ShadCN Dialog (Popup) */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Successful</DialogTitle>
            <DialogDescription>
                Your account has been created successfully. Please wait for the approval of the admin.
                Redirecting to login in {countdown} seconds...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button
              onClick={() => (window.location.href = "/login")} 
              className="px-4 py-2 rounded-md">
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}