import Kick from "@/assets/kick.png";
import Discord from "@/assets/new-discord.png";
import Twitch from "@/assets/twitch.svg";
import Layout from "@/components/layouts/layout";
import PricingTierCard from "@/components/pricing-card";
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
import { ActionStatus, PricingTier, type ActionResponse } from "@/openapi";
import dayjs from "dayjs";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Gavel,
  SlidersHorizontal,
  Webhook,
  Zap,
} from "lucide-react";
import React, { type FC, type HTMLAttributes } from "react";
import { Link } from "react-router";

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

const HeroSection: FC = () => (
  <section className="relative container flex h-screen w-full max-w-screen flex-col items-center justify-center overflow-hidden py-20 text-center md:py-32">
    {/* Blue glow at bottom */}
    <div
      className="pointer-events-none absolute top-0 h-[100px] w-[100px] -translate-y-full rounded-full bg-blue-500/60 shadow-[0_0_300px_150px_rgba(59,130,246,0.4)] md:h-[700px] md:w-[700px] md:-translate-y-[125%] md:shadow-[0_0_900px_450px_rgba(59,130,246,0.4)]"
      aria-hidden="true"
    />

    {/* Sprinkled platform logos around content */}
    <img
      src={Twitch}
      className="absolute top-[10%] left-[5%] h-12 -rotate-12 opacity-80 md:h-16"
      alt=""
    />
    <img
      src={Discord}
      className="absolute top-[15%] right-[8%] h-16 rotate-12 opacity-70 md:h-20"
      alt=""
    />
    <img
      src={Kick}
      className="absolute bottom-[20%] left-[10%] h-10 rotate-45 opacity-60 md:h-14"
      alt=""
    />
    <img
      src={Twitch}
      className="absolute right-[5%] bottom-[25%] h-14 -rotate-6 opacity-75 md:h-18"
      alt=""
    />
    <img
      src={Discord}
      className="absolute top-[40%] left-[15%] h-8 -rotate-20 opacity-50 md:h-12"
      alt=""
    />
    <img
      src={Kick}
      className="absolute top-[50%] right-[12%] h-12 rotate-25 opacity-65 md:h-16"
      alt=""
    />
    <img
      src={Twitch}
      className="absolute top-[60%] left-[3%] h-6 rotate-8 opacity-40 md:h-10"
      alt=""
    />
    <img
      src={Discord}
      className="absolute right-[15%] bottom-[10%] h-10 -rotate-30 opacity-55 md:h-14"
      alt=""
    />
    <img
      src={Kick}
      className="absolute top-[25%] left-[20%] h-9 rotate-18 opacity-45 md:h-12"
      alt=""
    />
    <img
      src={Twitch}
      className="absolute right-[18%] bottom-[35%] h-7 -rotate-15 opacity-50 md:h-11"
      alt=""
    />
    <img
      src={Discord}
      className="absolute top-[70%] right-[25%] h-9 rotate-35 opacity-40 md:h-13"
      alt=""
    />
    <img
      src={Kick}
      className="absolute top-[5%] left-[30%] h-5 -rotate-8 opacity-60 md:h-9"
      alt=""
    />

    <h1 className="relative z-10 text-3xl font-extrabold tracking-tighter sm:text-5xl">
      Intelligent Chat Moderation, <br className="hidden md:inline" />
      <span className="from-primary bg-gradient-to-r to-blue-400 bg-clip-text text-transparent">
        On Your Terms.
      </span>
    </h1>
    <p className="text-muted-foreground relative z-10 mx-auto mt-6 max-w-[700px] text-sm md:text-xl">
      Gova empowers you to create safer online communities. Define your rules,
      configure automated actions, and let our AI handle the toxicity, 24/7.
    </p>
    <div className="relative z-10 mt-8 flex flex-col gap-4 sm:flex-row">
      <Link to="/login">
        <Button size="lg">Get Started for Free</Button>
      </Link>
      <Link to="/contact-us">
        <Button
          size="lg"
          variant="outline"
          className="!bg-transparent backdrop-blur-md"
        >
          Request a Demo
        </Button>
      </Link>
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
        "Trigger custom actions. From warnings to bans based on rule severity. Full control over duration and reasoning.",
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
          Gova provides a powerful, flexible toolkit for modern community
          management.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:mx-auto lg:w-200">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="m-0 flex flex-col gap-2 border-0"
          >
            <CardHeader className="">
              <div className="text-primary mb-1 flex h-12 w-12 items-center justify-center rounded-lg">
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
      icon: Webhook,
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

        <div className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:mx-auto md:grid md:w-fit md:grid-cols-3 md:overflow-visible">
          <div className="absolute top-1/2 left-1/2 z-0 h-1 w-4 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-blue-500/60 shadow-[0_0_700px_300px_rgba(59,130,246,0.15)]" />

          {steps.map((step) => (
            <div
              key={step.title}
              className="bg-secondary border-stone-650 z-1 flex h-100 w-[280px] flex-none snap-start items-center justify-center rounded-xl border p-2"
            >
              <Card className="flex h-full w-full flex-col gap-1 overflow-hidden rounded-lg p-0">
                <CardHeader
                  className="block h-5/8 rounded-lg border-b px-4 pt-5 pb-4"
                  style={{
                    background:
                      "linear-gradient(to bottom, hsl(var(--muted)/0.3) 0%, hsl(var(--muted)/0.7) 100%)",
                    boxShadow:
                      "inset 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 2px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.06)",
                    borderBottom: "1px solid hsl(var(--border)/0.8)",
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <step.icon size={70} />
                  </div>
                </CardHeader>

                <CardContent>
                  <CardTitle className="pt-3 text-center text-lg font-semibold">
                    {step.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-center text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnalyticsDemoSection: FC = () => {
  const actions: ActionResponse[] = [
    {
      action_id: "8e8d0839-613f-450f-bbc2-3478455b3a8c",
      moderator_id: "mod-123",
      platform_user_id: "954075156215636000",
      action_type: "mute",
      action_params: {
        type: "mute",
        reason: "Use of profanity and disrespectful language.",
        user_id: 954075156215636000,
        duration: 3600000,
        requires_approval: true,
      },
      context: {
        message: "Bitches in this server",
      },
      status: ActionStatus.awaiting_approval,
      reason: "Use of profanity and disrespectful language.",
      created_at: "2025-11-07T12:12:55.273200+00:00",
      updated_at: "2025-11-07T12:12:55.273200+00:00",
      executed_at: null,
      error_msg: null,
    },
    {
      action_id: "5d19b42e-0db2-4d13-ab52-a4f813407d54",
      moderator_id: "mod-123",
      platform_user_id: "954075156215636000",
      action_type: "mute",
      action_params: {
        type: "mute",
        reason: "Use of profanity and disrespectful language.",
        user_id: 954075156215636000,
        duration: 3600000,
        requires_approval: true,
      },
      context: {
        message: "You're a faggot",
      },
      status: ActionStatus.awaiting_approval,
      reason: "Use of profanity and disrespectful language.",
      created_at: "2025-11-07T12:12:44.046285+00:00",
      updated_at: "2025-11-07T12:12:44.046285+00:00",
      executed_at: null,
      error_msg: null,
    },
    {
      action_id: "123217b8-5d75-4d8c-8466-a67d7d3dcef0",
      moderator_id: "mod-123",
      platform_user_id: "954075156215636000",
      action_type: "mute",
      action_params: {
        type: "mute",
        reason: "Use of profanity and disrespectful language.",
        user_id: 954075156215636000,
        duration: 300000,
        requires_approval: true,
      },
      context: {
        message: "Fuck you",
      },
      status: ActionStatus.awaiting_approval,
      reason: "Use of profanity and disrespectful language.",
      created_at: "2025-11-07T12:12:40.674488+00:00",
      updated_at: "2025-11-07T12:12:40.674488+00:00",
      executed_at: null,
      error_msg: null,
    },
  ];

  const getBadge = (status: ActionStatus) => {
    let className = "rounded-md px-2 py-0.5 text-xs font-medium capitalize ";

    switch (status) {
      case ActionStatus.completed:
        className +=
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        break;
      case ActionStatus.awaiting_approval:
        className +=
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        break;
      case ActionStatus.failed:
      case ActionStatus.rejected:
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
            Actions flagged by Gova requiring manual approval.
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
              {actions.map((action) => {
                const message =
                  (action.context as { message?: string })?.message || "";
                return (
                  <TableRow
                    key={action.action_id}
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
                      {message.slice(0, 20)}
                      {message.length > 20 && "..."}
                    </TableCell>
                    <TableCell className="text-right">
                      {action.status === ActionStatus.awaiting_approval && (
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
          {Object.values(PricingTier).map((v) => (
            <PricingTierCard key={v} pricingTier={v as PricingTier} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage: FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyticsDemoSection />
      <div className="mb-70 h-1 w-full bg-transparent" />
    </Layout>
  );
};

export default HomePage;
