import SiteLogo from "@/components/site-logo";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex h-16 items-center justify-between px-20 bg-background">
      <SiteLogo className="h-full" />
      <div className="flex h-full w-auto items-center gap-8">
        <Link to="#features">Features</Link>
        <Link to="">Pricing</Link>
        <Link to="/moderators" className="bg-white p-2 rounded-md text-background">Dashboard</Link>
      </div>
    </header>
  );
};

const HomePage = () => {
  return (
    <>
    <div className="min-h-screen">
      <Header />
      <section className="h-150 mt-16 bg-red-500">
      
      </section>
    </div>
    </>
  );
};

export default HomePage;
