import { AuthLayout } from "@/components/auth-layout";
import { PasswordInput } from "@/components/password-input";
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
  const loginMutation = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryParamsRef = useRef(new URLSearchParams(location.search));

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
    <AuthLayout>
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
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="johndoe@email.com"
            value={formData.email}
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
          <PasswordInput
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="text-muted-foreground w-full text-right text-xs">
            <Link
              to="/forgot-password"
              className="!p-1 text-xs hover:!bg-transparent hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>
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
    </AuthLayout>
  );
};

export default LoginPage;
