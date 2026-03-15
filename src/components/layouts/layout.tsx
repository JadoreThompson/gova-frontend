import { default as SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface MainLayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  ["Features", "/#features"],
  ["Demo", "/#demo"],
  ["Contact Us", "/contact-us"],
] as const;

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 z-50 w-full px-5">
      <div className="container mx-auto">
        <div className="bg-background/50 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md sm:border-0 sm:bg-transparent sm:backdrop-blur-none">
          <div
            className={`flex h-16 items-center justify-between px-4 md:px-6 ${
              isMenuOpen ? "rounded-b-none" : ""
            } sm:bg-transparent sm:backdrop-blur-none`}
          >
            <Link to="/">
              <SiteLogo className="h-15 w-15" />
            </Link>

            <nav className="bg-background/80 hidden items-center gap-6 rounded-lg border-x border-t-2 border-b-0 text-sm font-medium backdrop-blur-md md:flex md:px-4 md:py-4">
              {NAV_LINKS.map(([title, link]) => (
                <a
                  key={title}
                  href={link}
                  className="text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                  {title}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-4 md:flex">
              <Link to="/login">
                <Button>Launch</Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="!bg-transparent"
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
            <div className="border-white/10 md:hidden">
              <nav className="flex flex-col gap-2 p-4">
                {NAV_LINKS.map(([title, link]) => (
                  <a
                    key={title}
                    href={link}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground w-full rounded-lg px-4 py-3 transition-colors"
                  >
                    {title}
                  </a>
                ))}

                <div className="mt-2 flex w-full flex-col gap-2">
                  <Link to="/login" className="w-full">
                    <Button variant="ghost" className="w-full !bg-transparent">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer: FC = () => {
  const footerLinks = {
    Product: NAV_LINKS.slice(0, 2),
    Resources: [NAV_LINKS[2]],
  };

  return (
    <footer className="bg-background relative h-75 w-full border-t">
      <div className="absolute top-6/8 left-1/2 z-0 rounded-full bg-blue-500/60 shadow-[0_0_500px_250px_rgba(59,130,246,0.7)]" />

      {/* Full-width background */}
      <div className="bg-background absolute z-10 h-full w-full py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-15 grid grid-cols-2 gap-4 px-4 md:grid-cols-8 md:px-20">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h6 className="mb-2 font-semibold">{title}</h6>
                <ul className="space-y-1">
                  {links.map(([title, link]) => (
                    <li key={title}>
                      <a
                        href={link}
                        className="text-muted-foreground hover:text-foreground text-sm"
                      >
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-muted-foreground border-t pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Gova. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout: FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <div className="">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
