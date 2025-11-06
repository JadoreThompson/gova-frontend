import SiteLogo from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="bg-background fixed top-0 left-0 flex h-16 w-full items-center justify-between px-20">
      <SiteLogo className="h-full" />
      <div className="flex h-full w-auto items-center gap-8">
        <Link to="#features">Features</Link>
        <Link to="">Pricing</Link>
        <Link
          to="/moderators"
          className="text-background rounded-md bg-white p-2"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
};

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <section className="mt-16 h-150 px-15 py-30">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-semibold mb-2">Automated moderation</h1>
            <p className=" mb-3">
              Keep your community safe with a 24/7 watchdog enforcing your
              uidelines
            </p>
            <Button>Get Started</Button>
          </div>
        </section>
        <section className="flex items-center">
        <h3>ACtions</h3>
      <h2>Automated Moderation</h2>
      <p>Automate your bans, kicks, mutes and other actions, optinally require approval</p>
        </section>
      </div>
    </>
  );
};

export default HomePage;
