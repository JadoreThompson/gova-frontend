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
import { useLogoutMutation, useMeQuery } from "@/hooks/auth-hooks";
import { OAUTH2_URLS } from "@/lib/utils/utils";
import { MessagePlatformType } from "@/openapi";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import PricingTierBadge from "@/components/pricing-tier-badge";
import {
  useChangePasswordMutation,
  useChangeUsernameMutation,
  useVerifyActionMutation,
} from "@/hooks/auth-hooks";
import { VerifyActionAction } from "@/openapi";
import { Loader2 } from "lucide-react";
import { type FormEvent } from "react";

type UsernameStep = "enter-username" | "verify-code";

interface ChangeUsernameCardProps {
  initialUsername: string;
}

const ChangeUsernameCard: FC<ChangeUsernameCardProps> = ({
  initialUsername,
}) => {
  const [step, setStep] = useState<UsernameStep>("enter-username");
  const [username, setUsername] = useState(initialUsername);
  const [code, setCode] = useState("");

  const meQuery = useMeQuery();
  const changeUsernameMutation = useChangeUsernameMutation();
  const verifyActionMutation = useVerifyActionMutation();

  useEffect(() => {
    setUsername(initialUsername);
  }, [initialUsername]);

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() === initialUsername) {
      toast.info("This is already your username.");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }

    changeUsernameMutation
      .mutateAsync({ username })
      .then(() => {
        toast.info("A verification code has been sent to your email.");
        setStep("verify-code");
      })
      .catch((err) => {
        const message =
          err?.body?.detail ||
          "Failed to initiate username change. Please try again.";
        toast.error(message);
      });
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    verifyActionMutation
      .mutateAsync({ code, action: VerifyActionAction.change_username })
      .then(() => {
        toast.success("Your username has been changed successfully!");
        setCode("");
        setStep("enter-username");
        meQuery.refetch(); // Refetch user data to update the whole profile page
      })
      .catch(() => {
        toast.error("Invalid or expired verification code.");
      });
  };

  if (step === "verify-code") {
    return (
      <Card>
        <form onSubmit={handleCodeSubmit}>
          <CardHeader className="mb-1">
            <CardTitle className="mb-1">Verify Username Change</CardTitle>
            <CardDescription>
              Enter the code sent to your email to confirm the change.
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-3">
            <Input
              id="code"
              name="code"
              placeholder="Enter your verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={verifyActionMutation.isPending}
              className="mb-2"
              required
            />
            <Button
              variant="link"
              type="button"
              onClick={() => setStep("enter-username")}
              className="h-auto !p-0 "
            >
              Use a different username?
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={verifyActionMutation.isPending}>
              {verifyActionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleUsernameSubmit} className="">
        <CardHeader className="mb-3">
          <CardTitle>Username</CardTitle>
          <CardDescription>This is your public display name.</CardDescription>
        </CardHeader>
        <CardContent className="mb-3">
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={changeUsernameMutation.isPending}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={
              changeUsernameMutation.isPending || username === initialUsername
            }
          >
            {changeUsernameMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

type PasswordStep = "enter-password" | "verify-code";

const ChangePasswordCard: FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<PasswordStep>("enter-password");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const changePasswordMutation = useChangePasswordMutation();
  const verifyActionMutation = useVerifyActionMutation();
  const logoutMutation = useLogoutMutation();

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    changePasswordMutation
      .mutateAsync({ password })
      .then(() => {
        toast.info("A verification code has been sent to your email.");
        setStep("verify-code");
      })
      .catch((err) => {
        const message =
          err?.body?.detail ||
          "Failed to initiate password change. Please try again.";
        toast.error(message);
      });
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    verifyActionMutation
      .mutateAsync({ code, action: VerifyActionAction.change_password })
      .then(() => {
        toast.success("Password changed successfully! You will be logged out.");
        setTimeout(() => {
          logoutMutation.mutateAsync().finally(() => {
            navigate("/login", { replace: true });
          });
        }, 2000);
      })
      .catch(() => {
        toast.error("Invalid or expired verification code.");
      });
  };

  if (step === "verify-code") {
    return (
      <Card>
        <form onSubmit={handleCodeSubmit}>
          <CardHeader className="mb-1">
            <CardTitle className="mb-1">Verify Password Change</CardTitle>
            <CardDescription>
              Enter the code sent to your email to confirm the change. After
              saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
                    <CardContent className="mb-3">


              <Input
                id="code"
                name="code"
                placeholder="Enter your verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={
                  verifyActionMutation.isPending || logoutMutation.isPending
                }
                className="mb-2"
                required
              />

            <Button
              variant="link"
              type="button"
              onClick={() => setStep("enter-password")}
              className="h-auto !p-0"
            >
              Use a different password?
            </Button>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={
                verifyActionMutation.isPending || logoutMutation.isPending
              }
            >
              {verifyActionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handlePasswordSubmit}>
        <CardHeader className="mb-3">
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter a new password. After saving, you'll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-3 grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Password"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const ProfilePage: FC = () => {
  const meQuery = useMeQuery();

  return (
    <DashboardLayout>
      <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-6">
        {meQuery.isPending ? (
          <div className="flex h-60 items-center justify-center">
            Loading...
          </div>
        ) : meQuery.isError || !meQuery.data ? (
          <div className="text-destructive flex h-60 items-center justify-center">
            Failed to load profile data.
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 border-b pb-6">
              <div className="h-20 w-20 overflow-hidden rounded-full border shadow">
                <img
                  src={`https://ui-avatars.com/api/?name=${meQuery.data.username}`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-xl font-semibold">
                  {meQuery.data.username}
                </h2>
                <PricingTierBadge tier={meQuery.data.pricing_tier} />
              </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="flex w-full">
                <TabsTrigger
                  value="general"
                  className="flex-1 focus:!outline-none"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex-1 focus:!outline-none"
                >
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6 space-y-6">
                <ChangeUsernameCard initialUsername={meQuery.data.username} />

                <Card>
                  <CardHeader>
                    <CardTitle>Connections</CardTitle>
                    <CardDescription>
                      Connect your account to other platforms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <ChangePasswordCard />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
