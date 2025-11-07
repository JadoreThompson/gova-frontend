import { default as PricingTierCard } from "@/components/pricing-card";
import { default as SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionStatus, PricingTierType, type ActionResponse } from "@/openapi";
import dayjs from "dayjs";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Cpu,
  Gavel,
  GitBranch,
  Menu,
  SlidersHorizontal,
  X,
  Zap,
} from "lucide-react";
import React, { useState, type FC, type HTMLAttributes } from "react";

interface IconProps extends HTMLAttributes<SVGElement> {
  children?: never;
  color?: string;
  size?: string | number;
}

type Feature = {
  icon: React.ElementType<IconProps>;
  title: string;
  description: string;
};

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = ["Features", "Demo", "Pricing", "Docs"];

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <SiteLogo className="h-15 w-15" />

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="bg-background border-t md:hidden">
          <nav className="flex flex-col items-center gap-4 p-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground w-full py-2 text-center"
              >
                {link}
              </a>
            ))}
            <div className="mt-4 flex w-full flex-col gap-2">
              <Button variant="ghost" className="w-full">
                Log In
              </Button>
              <Button className="w-full">Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const HeroSection: FC = () => (
  <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32 lg:py-40">
    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
      Intelligent Chat Moderation, <br className="hidden md:inline" />
      <span className="from-primary bg-gradient-to-r to-blue-400 bg-clip-text text-transparent">
        On Your Terms.
      </span>
    </h1>
    <p className="text-muted-foreground mx-auto mt-6 max-w-[700px] text-lg md:text-xl">
      ModGuard AI empowers you to create safer online communities. Define your
      rules, configure automated actions, and let our AI handle the toxicity,
      24/7.
    </p>
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <Button size="lg">Get Started for Free</Button>
      <Button size="lg" variant="outline">
        Request a Demo
      </Button>
    </div>
  </section>
);

const FeaturesSection: FC = () => {
  const features: Feature[] = [
    {
      icon: SlidersHorizontal,
      title: "Dynamic Policy Engine",
      description:
        "Define nuanced, context-aware rules that adapt to your community's culture, not just a blocklist.",
    },
    {
      icon: Gavel,
      title: "Automated Enforcement",
      description:
        "Trigger custom actions—from warnings to bans—based on rule severity. Full control over duration and reasoning.",
    },
    {
      icon: CheckCircle,
      title: "Approval Workflow",
      description:
        "Flag sensitive cases for manual review. The AI proposes an action, you make the final call.",
    },
    {
      icon: BarChart3,
      title: "Moderation Insights",
      description:
        "Track community health with a unified dashboard. Monitor AI performance, moderator activity, and content trends.",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything You Need to Build a Safer Community
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          ModGuard AI provides a powerful, flexible toolkit for modern community
          management.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-semibold">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const HowItWorksSection: FC = () => {
  const steps = [
    {
      icon: GitBranch,
      title: "Connect Your Stack",
      description:
        "Integrate in minutes with our SDKs and webhooks. Compatible with Discord and other platforms coming soon.",
    },
    {
      icon: BookOpen,
      title: "Craft Your Policy",
      description:
        "Visually build your moderation policy. From simple keyword blocks to complex, context-aware rules.",
    },
    {
      icon: Cpu,
      title: "Automate Enforcement",
      description:
        "Decide the AI's response to violations: from silent warnings to automated timeouts with optional human review.",
    },
    {
      icon: Zap,
      title: "Launch & Iterate",
      description:
        "Deploy your AI moderator and gain insights from the dashboard. Refine your rules on the fly for optimal performance.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            A simple, four-step process to automate your chat moderation.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.title} className="flex flex-col">
              <CardHeader>
                <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <step.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnalyticsDemoSection: FC = () => {
  const actions: ActionResponse[] = [
    {
      log_id: "8e8d0839-613f-450f-bbc2-3478455b3a8c",
      action_type: "mute",
      action_params: {
        type: "mute",
        reason: "Use of profanity and disrespectful language.",
        user_id: 954075156215636000,
        duration: 3600000,
        requires_approval: true,
      },
      status: "awaiting_approval",
      created_at: "2025-11-07T12:12:55.273200+00:00",
      message: "Bitches in this server",
    },
    {
      log_id: "5d19b42e-0db2-4d13-ab52-a4f813407d54",
      action_type: "mute",
      action_params: {
        type: "mute",
        reason: "Use of profanity and disrespectful language.",
        user_id: 954075156215636000,
        duration: 3600000,
        requires_approval: true,
      },
      status: "awaiting_approval",
      created_at: "2025-11-07T12:12:44.046285+00:00",
      message: "You're a faggot",
    },
    {
      log_id: "123217b8-5d75-4d8c-8466-a67d7d3dcef0",
      action_type: "mute",
      action_params: {
        type: "mute",
        reason: "Use of profanity and disrespectful language.",
        user_id: 954075156215636000,
        duration: 300000,
        requires_approval: true,
      },
      status: "awaiting_approval",
      created_at: "2025-11-07T12:12:40.674488+00:00",
      message: "Fuck you",
    },
  ];

  const getBadge = (status: ActionStatus) => {
    let className = "rounded-md px-2 py-0.5 text-xs font-medium capitalize ";

    switch (status) {
      case ActionStatus.success:
      case ActionStatus.approved:
        className +=
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        break;
      case ActionStatus.awaiting_approval:
        className +=
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        break;
      case ActionStatus.failed:
      case ActionStatus.declined:
        className +=
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        break;
      default:
        className +=
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        break;
    }
    return <span className={className}>{status.replace(/_/g, " ")}</span>;
  };

  return (
    <section id="demo" className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Control at Your Fingertips
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          Visualize moderation activity and approve or deny actions with a
          single click. Our dashboard puts you in command.
        </p>
      </div>
      <Card className="mx-auto max-w-4xl overflow-hidden">
        <CardHeader>
          <CardTitle>Moderation Approval Queue</CardTitle>
          <CardDescription>
            Actions flagged by ModGuard AI requiring manual approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-neutral-800">
              <TableRow>
                <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                  Type
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                  Created At
                </TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                  Status
                </TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {actions.map((action) => (
                <TableRow
                  key={action.log_id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  <TableCell className="capitalize">
                    {action.action_type}
                  </TableCell>
                  <TableCell>
                    {dayjs(action.created_at).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>{getBadge(action.status)}</TableCell>
                  <TableCell className="ellipsis">
                    {action.message.slice(0, 20)}
                    {action.message.length > 20 && "..."}
                  </TableCell>
                  <TableCell className="text-right">
                    {action.status === ActionStatus.awaiting_approval && (
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

const PricingSection: FC = () => {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Fair & Simple Pricing
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Choose a plan that scales with your community's needs.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {Object.values(PricingTierType).map((v) => (
            <PricingTierCard key={v} pricingTier={v} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: FC = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Docs", "Demo"],
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SiteLogo className="h-20 w-20" />
            <p className="text-muted-foreground max-w-xs">
              AI-powered chat moderation for safer online communities.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} ModGuard AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const HomePage: FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen antialiased">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AnalyticsDemoSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
