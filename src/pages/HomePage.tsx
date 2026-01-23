import MainLayout from "@/components/layouts/main-layout";
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
import { ActionStatus, type ActionResponse } from "@/openapi";
import dayjs from "dayjs";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Cpu,
  Gavel,
  GitBranch,
  SlidersHorizontal,
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
  <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32 lg:py-40">
    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
      Intelligent Chat Moderation, <br className="hidden md:inline" />
      <span className="from-primary bg-gradient-to-r to-blue-400 bg-clip-text text-transparent">
        On Your Terms.
      </span>
    </h1>
    <p className="text-muted-foreground mx-auto mt-6 max-w-[700px] text-lg md:text-xl">
      Gova empowers you to create safer online communities. Define your rules,
      configure automated actions, and let our AI handle the toxicity, 24/7.
    </p>
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <Link to="/login">
        <Button size="lg">Get Started for Free</Button>
      </Link>
      <Link to="/contact-us">
        <Button size="lg" variant="outline">
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
          Gova provides a powerful, flexible toolkit for modern community
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

// const PricingSection: FC = () => {
//   return (
//     <section id="pricing" className="py-16 md:py-24">
//       <div className="container mx-auto px-4">
//         <div className="mx-auto mb-12 max-w-2xl text-center">
//           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
//             Fair & Simple Pricing
//           </h2>
//           <p className="text-muted-foreground mt-4 text-lg">
//             Choose a plan that scales with your community's needs.
//           </p>
//         </div>
//         <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
//           {Object.values(PricingTierType).map((v) => (
//             <PricingTierCard key={v} pricingTier={v} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

const HomePage: FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AnalyticsDemoSection />
      {/* <PricingSection /> */}
    </MainLayout>
  );
};

export default HomePage;
