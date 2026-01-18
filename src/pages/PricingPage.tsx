import PricingTierCard from "@/components/pricing-card";
import { PricingTier } from "@/openapi";
import { type FC } from "react";

const PricingPage: FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed-positioned inner section */}
      <div className="bg-secondary fixed inset-0 m-2 flex flex-col items-center justify-center overflow-y-auto rounded-md border p-4 sm:m-4 sm:p-6 md:p-10 lg:m-8">
        <h2 className="mb-3 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          Plans and Pricing
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl text-center text-sm sm:text-base">
          Choose a plan that fits your needs. Upgrade anytime as your team
          grows.
        </p>

        {/* Responsive Pricing Grid */}
        <div className="grid w-full grid-cols-1 gap-6 px-2 sm:grid-cols-2 sm:gap-8 sm:px-0 md:max-w-6xl lg:grid-cols-3">
          {Object.values(PricingTier).map((v) => (
            <PricingTierCard key={v} pricingTier={v} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
