import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { type FC } from "react";

const PricingCard: FC<{
  planType?: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}> = (props) => {
  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto transition-transform duration-300",
        props.planType === "pro" &&
          "scale-[1.03] rounded-xl bg-blue-400 p-1"
      )}
    >
      {props.planType === "pro" && (
        <div className="text-center text-sm font-semibold text-blue-900 mb-1">
          Recommended
        </div>
      )}
      <Card
        className="flex flex-col gap-2 shadow-gray-500/20"
        style={{
          boxShadow:
            props.planType === "pro"
              ? "1px 1px 12px 1px rgba(0, 0, 0, 0.5)"
              : "",
        }}
      >
        <CardHeader>
          <h3 className="text-2xl font-semibold">{props.title}</h3>
          <p className="text-muted-foreground mb-3">{props.description}</p>
          <div className="border-b pb-5">
            <span className="mr-1 text-3xl font-bold">{props.price}</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <p className="font-semibold mb-2">What's included:</p>
          <ul className="space-y-2">
            {props.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check size={20} className="text-green-500 mt-[2px]" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PricingPage: FC = () => {
  const pricingCardConfigs = [
    {
      title: "Free Plan",
      description: "Basic features for personal use",
      price: "$0",
      features: [
        "Up to 1,000 messages moderated",
        "Basic moderation tools",
        "Email support",
      ],
    },
    {
      planType: "pro",
      title: "Pro Plan",
      description: "Advanced features for professionals",
      price: "$29",
      features: [
        "Up to 100,000 messages moderated",
        "Advanced moderation tools",
        "Priority email support",
      ],
    },
    {
      title: "Enterprise Plan",
      description: "All features for large organizations",
      price: "Contact us",
      features: [
        "Unlimited messages moderated",
        "All moderation tools",
        "Dedicated support",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed-positioned inner section */}
      <div className="fixed inset-0 m-2 sm:m-4 lg:m-8 bg-secondary flex flex-col items-center justify-center rounded-md border p-4 sm:p-6 md:p-10 overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
          Plans and Pricing
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mb-10 text-sm sm:text-base">
          Choose a plan that fits your needs. Upgrade anytime as your team grows.
        </p>

        {/* Responsive Pricing Grid */}
        <div className="grid w-full gap-6 sm:gap-8 md:max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
          {pricingCardConfigs.map((config) => (
            <PricingCard
              key={config.title}
              planType={config.planType}
              title={config.title}
              description={config.description}
              price={config.price}
              features={config.features}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
