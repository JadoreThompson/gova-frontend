import { Button } from "@/components/ui/button";
import type { FC } from "react";
import { Link } from "react-router";

const HomePage: FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4">
      <h1 className="text-4xl font-bold">AI Moderation Platform</h1>
      <p className="text-muted-foreground">Manage your guidelines and deployments easily.</p>
      <Link to="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    </div>
  );
};
export default HomePage;