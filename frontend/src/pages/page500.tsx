import SiteLogo from "@/components/site-logo";
import { type FC } from "react";
import { useNavigate } from "react-router";

const Page500: FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed-centered container similar to PricingPage */}
      <div className="bg-secondary fixed inset-0 m-2 flex flex-col items-center justify-center rounded-md border p-4 sm:m-4 sm:p-6 md:p-10 lg:m-8">
        <div onClick={handleGoHome} className="cursor-pointer">
          <SiteLogo className="h-30"></SiteLogo>
        </div>
        <h2 className="mb-3 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          Oops! Something went wrong.
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl text-center text-sm sm:text-base">
          It looks like our servers ran into an issue. Don’t worry — it’s not
          your fault. Please try again later or return to safety.
        </p>
      </div>
    </div>
  );
};

export default Page500;
