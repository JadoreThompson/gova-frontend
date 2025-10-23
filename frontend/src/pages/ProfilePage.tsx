import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagePlatformImg from "@/components/message-platform-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLogoutMutation,
  useMeQuery,
  useUpdatePasswordMutation,
  useUpdateUsernameMutation,
} from "@/hooks/auth-hooks";
import { OAUTH2_URLS } from "@/lib/utils/utils";
import { MessagePlatformType } from "@/openapi";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const ProfilePage: FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const meQuery = useMeQuery();
  const updateUsernameMutation = useUpdateUsernameMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    if (meQuery.data?.username) setUsername(meQuery.data.username);
  }, [meQuery.data]);

  const handleSaveUsername = async () => {
    if (!username.trim()) return toast.error("Username cannot be empty");

    await updateUsernameMutation
      .mutateAsync({ username })
      .then(() => {
        toast.success("Username updated successfully");
        meQuery.refetch();
      })
      .catch(() => toast.error("Failed to update username"));
  };

  const handleSavePassword = async () => {
    if (!newPassword.trim()) return toast.error("New password required");

    await updatePasswordMutation
      .mutateAsync({ password: newPassword })
      .then(() => {
        toast.success("Password changed — please log in again");
        logoutMutation.mutateAsync();
        navigate("/login", { replace: true });
      })
      .catch(() => toast.error("Failed to change password"));
  };

  return (
    <DashboardLayout>
      <div className="mx-auto mt-8 flex w-5xl flex-col gap-6">
        {meQuery.isPending ? (
          <div className="flex h-60 items-center justify-center">
            Loading...
          </div>
        ) : (
          <>
            {/* Top row — profile photo + username */}
            <div className="flex flex-col items-center gap-2 border-b pb-6">
              <div className="h-20 w-20 overflow-hidden rounded-full border shadow">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    meQuery.data?.username ?? "User"
                  }`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold">
                {meQuery.data?.username}
              </h2>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* --- GENERAL TAB --- */}
              <TabsContent value="general">
                <Card className="border-none">
                  <CardHeader>
                    <CardTitle>General</CardTitle>
                    <CardDescription>
                      Update your username and manage your connections.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    {/* Connections */}
                    <div className="grid gap-3">
                      <Label>Connections</Label>
                      <div className="flex flex-col gap-3">
                        {Object.values(MessagePlatformType).map((platform) => {
                          const conn = meQuery.data?.connections?.[platform];
                          return (
                            <div
                              key={platform}
                              className="bg-secondary flex h-10 w-full items-center justify-between rounded-md border px-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md">
                                  <MessagePlatformImg platform={platform} />
                                </div>
                                <span className="text-sm font-medium capitalize">
                                  {platform}
                                </span>
                              </div>

                              {conn ? (
                                <span className="text-muted-foreground text-sm">
                                  Connected as {conn.username}
                                </span>
                              ) : (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  asChild
                                  className="text-xs"
                                >
                                  <a
                                    href={OAUTH2_URLS[platform]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Connect
                                  </a>
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSaveUsername}
                      disabled={updateUsernameMutation.isPending}
                    >
                      {updateUsernameMutation.isPending
                        ? "Saving..."
                        : "Save changes"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* --- SECURITY TAB --- */}
              <TabsContent value="security">
                <Card className="border-none">
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you’ll be logged
                      out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="current-password">Current password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="new-password">New password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSavePassword}
                      disabled={updatePasswordMutation.isPending}
                    >
                      {updatePasswordMutation.isPending
                        ? "Saving..."
                        : "Save password"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
