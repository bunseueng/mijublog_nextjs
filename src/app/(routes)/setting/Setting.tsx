"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useSocket } from "@/provider/SocketProvider";
import { User } from "@/types/BlogPost";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Separator } from "@radix-ui/react-select";
import { Eye, EyeOff, Lock, Save, Trash2, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface SettingProps {
  user: User[];
}

const Setting = ({ user }: SettingProps) => {
  const { data: session } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState<User | undefined>(undefined);
  const socket = useSocket();

  useEffect(() => {
    if (session && user) {
      const user_data = user.find((u) => u.id === session.user.id);
      setProfileData(user_data);
    }
  }, [session, user]); // run when session or user changes

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("profile:update", (profileData) => {
      setProfileData({ ...profileData });
    });

    return () => {
      socket.off("profile:update");
    };
  }, [socket]);

  if (!profileData) {
    return null; // or loading spinner
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const img64 = await convertFileToBase64(file);
      setProfileData({ ...profileData, image: img64 });
    }
  };

  const onSubmit = async () => {
    try {
      const res = await fetch(`/api/auth/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: profileData.image,
          image_public_id: profileData.image_public_id,
          name: profileData.name,
          email: profileData.email,
          description: profileData.description,
          password: profileData.password,
        }),
      });

      const data = await res.json();

      socket?.emit("profile:update", data.updatingProfile);
      if (data) {
        toast("Successfully updating profile");
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      const res = await fetch("/api/auth/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon icon="tabler:user-filled" width="24" height="24" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your profile details and public information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 rounded-full">
                  <AvatarImage
                    src={`${profileData?.image}` || "/placeholder.svg"}
                    alt={profileData?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg font-bold">
                    SJ
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </div>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData?.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData!, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData?.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData!, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={(profileData?.description as string) || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData!,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {profileData?.description?.length}/500 characters
                  </p>
                </div>
              </div>

              <Button className="gap-2" onClick={onSubmit}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings & Preferences */}
        <div className="space-y-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                size="sm"
                className="w-full gap-2"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Setting;
