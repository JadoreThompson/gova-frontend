import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type PricingTierType } from "@/openapi";
import { Check } from "lucide-react";
import { type FC } from "react";
import { Link, useNavigate } from "react-router";

const PricingTierCard: FC<{
  pricingTier: PricingTierType;
}> = (props) => {
  const navigate = useNavigate();

  const sendToPaymentLink = async () => {
    try {
      const rsp = await fetch(
        import.meta.env.VITE_HTTP_BASE_URL + "/payments/payment-link",
        { credentials: "include" },
      );
      const data = await rsp.json();

      if (rsp.ok) {
        return window.open((data as { url: string }).url, "_blank");
      }

      if (rsp.status === 400) {
        return navigate("/moderators");
      }

      if (rsp.status === 401) {
        return navigate(`/login?next=/pricing`);
      }

      if (rsp.status === 500) {
        return navigate("/500");
      }

      throw Error((data as { error: string }).error);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  // Determine tier-based configuration
  let tierConfig: {
    planType: "free" | "pro" | "enterprise";
    title: string;
    description: string;
    price: string;
    features: string[];
  };

  switch (props.pricingTier) {
    case "free":
      tierConfig = {
        planType: "free",
        title: "Free Plan",
        description: "Basic features for personal use",
        price: "$0",
        features: [
          "Up to 1,000 messages moderated",
          "Basic moderation tools",
          "Email support",
        ],
      };
      break;
    case "pro":
      tierConfig = {
        planType: "pro",
        title: "Pro Plan",
        description: "Advanced features for professionals",
        price: "$29",
        features: [
          "Up to 100,000 messages moderated",
          "Advanced moderation tools",
          "Priority email support",
        ],
      };
      break;
    case "enterprise":
      tierConfig = {
        planType: "enterprise",
        title: "Enterprise Plan",
        description: "All features for large organizations",
        price: "Contact us",
        features: [
          "Unlimited messages moderated",
          "All moderation tools",
          "Dedicated support",
        ],
      };
      break;
    default:
      throw new Error(`Unknown pricing tier: ${props.pricingTier}`);
  }

  // Compute CTA
  let cta = null;
  if (tierConfig.planType === "enterprise") {
    cta = (
      <Link to="/contact-us" className="w-full">
        <Button className="w-full">Contact Us</Button>
      </Link>
    );
  } else if (tierConfig.planType === "pro") {
    cta = (
      <Button onClick={sendToPaymentLink} className="w-full">
        Get Started
      </Button>
    );
  } else {
    cta = (
      <Link to="/login" className="w-full">
        <Button className="w-full">Get Started</Button>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-sm transition-transform duration-300",
        tierConfig.planType === "pro" &&
          "scale-[1.03] rounded-xl bg-blue-400 p-1",
      )}
    >
      {tierConfig.planType === "pro" && (
        <div className="mb-1 text-center text-sm font-semibold text-blue-900">
          Recommended
        </div>
      )}
      <Card
        className="flex flex-col gap-2 shadow-gray-500/20"
        style={{
          boxShadow:
            tierConfig.planType === "pro"
              ? "1px 1px 12px 1px rgba(0, 0, 0, 0.5)"
              : "",
        }}
      >
        <CardHeader>
          <h3 className="text-2xl font-semibold">{tierConfig.title}</h3>
          <p className="text-muted-foreground mb-3">{tierConfig.description}</p>
          <div className="border-b pb-5">
            <span className="mr-1 text-3xl font-bold">{tierConfig.price}</span>
            {tierConfig.planType !== "enterprise" && (
              <span className="text-muted-foreground text-sm">/month</span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-8">
          <p className="mb-2 font-semibold">What's included:</p>
          <ul className="space-y-2">
            {tierConfig.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check size={20} className="mt-[2px] text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>{cta}</CardFooter>
      </Card>
    </div>
  );
};

export default PricingTierCard;
