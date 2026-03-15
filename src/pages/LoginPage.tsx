import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/queries/auth-hooks";
import { useRedirectAuthenticated } from "@/hooks/redirect-authenticated";
import { useRef, useState, type FC } from "react";
import { Link, useLocation, useNavigate } from "react-router";

const LoginPage: FC = () => {
  useRedirectAuthenticated({ to: "/moderators" });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParamsRef = useRef(new URLSearchParams(location.search));
  const loginMutation = useLoginMutation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      loginMutation.mutateAsync(formData).then(() => {
        const next = queryParamsRef.current.get("next");
        if (next) {
          if (next.startsWith("/")) {
            return navigate(next);
          } else {
            return window.open(next, "_blank");
          }
        }
        return navigate("/moderators");
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {/* Rising sun glow */}
      <div
        className="glow-pulse pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[120%] rounded-full"
        style={{
          width: "600px",
          height: "600px",
          boxShadow:
            "0 0 120px 80px rgba(59,130,246,0.3), 0 0 300px 180px rgba(59,130,246,0.18), 0 0 500px 300px rgba(59,130,246,0.08)",
        }}
        aria-hidden="true"
      />

      {/* Horizon shimmer */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(59,130,246,0) 20%, rgba(99,179,246,0.6) 50%, rgba(59,130,246,0) 80%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div
          className="relative rounded-2xl border px-10 py-10"
          style={{
            background: "oklch(0.205 0 0)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 0 32px 64px -12px rgba(0,0,0,0.7), 0 16px 32px -8px rgba(0,0,0,0.5), 0 0 80px -20px rgba(59,130,246,0.15)",
          }}
        >
          {/* Bottom shimmer accent */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-px rounded-b-2xl"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(99,102,241,0.4) 30%, rgba(99,102,241,0.8) 50%, rgba(99,102,241,0.4) 70%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Heading */}
          <h2
            className="text-foreground mb-1 text-center text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Welcome Back
          </h2>

          <div
            className="mb-7 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
            }}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="your_username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-background placeholder:text-muted-foreground/40 focus-visible:ring-0"
              />
            </div>

            <div>
              <label
                className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-background placeholder:text-muted-foreground/40 focus-visible:ring-0"
              />
            </div>

            <Button
              type="submit"
              className="relative w-full overflow-hidden font-semibold text-white"
              disabled={loginMutation.isPending}
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(59,130,246,0.4), 0 1px 3px rgba(0,0,0,0.3)",
                border: "none",
              }}
            >
              {/* Inner shine */}
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                aria-hidden="true"
              />
              {loginMutation.isPending ? "Signing in…" : "Sign In"}
            </Button>

            {loginMutation.isError && (
              <p
                className="rounded-lg border px-3.5 py-2.5 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  borderColor: "rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                }}
              >
                Login failed. Please check your credentials.
              </p>
            )}
          </form>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={`/register${queryParamsRef.current.toString() ? `?${queryParamsRef.current.toString()}` : ""}`}
              className="font-medium transition-colors hover:text-blue-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
