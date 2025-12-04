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
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/">
          <SiteLogo className="h-15 w-15" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map(([title, link]) => (
            <a
              key={title}
              href={link}
              className="text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="bg-background border-t md:hidden">
          <nav className="flex flex-col items-center gap-4 p-4">
            {NAV_LINKS.map(([title, link]) => (
              <a
                key={title}
                href={link}
                onClick={() => setIsMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground w-full py-2 text-center"
              >
                {title}
              </a>
            ))}
            <div className="mt-4 flex w-full flex-col gap-2">
              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  Log In
                </Button>
              </Link>
              {/* <a href="/login" className="w-full"></a> */}
              <Link to="/register" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer: FC = () => {
  const footerLinks = {
    Product: NAV_LINKS.slice(0, 2),
    Resources: [NAV_LINKS[2]],
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SiteLogo className="h-20 w-20" />
            <p className="text-muted-foreground max-w-xs">
              AI-powered chat moderation for safer online communities.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold">{title}</h4>
              <ul className="space-y-3">
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
        <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <div className="bg-background text-foreground min-h-screen antialiased">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
