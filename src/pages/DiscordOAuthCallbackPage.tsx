import SiteLogo from "@/components/site-logo";
import { discordOauthCallbackAuthDiscordOauthGet } from "@/openapi";
import { type FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const DiscordOAuthCallbackPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    // If no code is present, redirect to /moderators
    if (!code) {
      navigate("/moderators");
      return;
    }

    // Call the Discord OAuth endpoint with the code
    const handleOAuthCallback = async () => {
      try {
        const response = await discordOauthCallbackAuthDiscordOauthGet({
          code,
        });

        // On success (204), navigate to /connections
        if (response.status === 204) {
          navigate("/connections");
        }
      } catch (err) {
        // On error, show error message and redirect after a delay
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to connect Discord account";
        setError(errorMessage);

        // Redirect to /connections after 3 seconds
        setTimeout(() => {
          navigate("/connections");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  // Loading state - show animated logo
  if (!error) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <div className="animate-pulse-scale">
          <SiteLogo className="h-32 w-32" />
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="bg-background flex h-screen w-full flex-col items-center justify-center gap-6 p-8">
      <SiteLogo className="h-24 w-24" />
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-500">
          Connection Failed
        </h1>
        <p className="text-muted-foreground mb-2">{error}</p>
        <p className="text-muted-foreground text-sm">
          Redirecting to connections page...
        </p>
      </div>
    </div>
  );
};

export default DiscordOAuthCallbackPage;
