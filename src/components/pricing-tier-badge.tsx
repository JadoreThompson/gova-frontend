import { cn } from "@/lib/utils";
import { PricingTier, type PricingTier as Tier } from "@/openapi";
import type { FC } from "react";

const tierDetails: Record<Tier, { label: string; className: string }> = {
  [PricingTier.free]: {
    label: "Free",
    className: `
      bg-gray-500/10 text-gray-500 border-gray-500
      dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-300
    `,
  },
  [PricingTier.pro]: {
    label: "Pro",
    className: `
      bg-blue-500/10 text-blue-500 border-blue-500
      dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-300
    `,
  },
  // [PricingTier.enterprise]: {
  //   label: "Enterprise",
  //   className: `
  //     bg-purple-500/10 text-purple-500 border-purple-500
  //     dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-300
  //   `,
  // },
};

const PricingTierBadge: FC<{ tier: Tier }> = ({ tier }) => {
  const details = tierDetails[tier] || tierDetails[PricingTier.free];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium select-none",
        details.className,
      )}
    >
      {details.label}
    </span>
  );
};

export default PricingTierBadge;
