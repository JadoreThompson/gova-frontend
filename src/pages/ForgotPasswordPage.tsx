import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/hooks/queries/auth-hooks";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useState, type FC, type FormEvent } from "react";
import { Link } from "react-router";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    try {
      //   setIsPending(true);
      await forgotPasswordMutation.mutateAsync({ email });
      setEmailSent(true);
    } catch {
      setErrorMessage("Unable to send reset email. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout>
      {!emailSent ? (
        <>
          {/* Heading */}
          <h2
            className="text-foreground mb-1 text-center text-2xl font-semibold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            Reset Password
          </h2>

          <p className="text-muted-foreground mb-5 text-center text-sm leading-relaxed">
            Enter your email and we'll send you a password reset link.
          </p>

          <div
            className="mb-7 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
            }}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest"
                htmlFor="email"
              >
                Email Address
              </label>

              <div className="bg-input/30 border-input mb-1 flex rounded-md border">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  required
                  className="border-0 !bg-transparent focus-visible:!bg-transparent focus-visible:ring-0"
                />

                <div className="text-muted-foreground flex aspect-square items-center justify-center px-3">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
            </div>

            {errorMessage && (
              <p
                className="rounded-lg border px-3.5 py-2.5 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  borderColor: "rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                }}
              >
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="relative w-full overflow-hidden font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(59,130,246,0.4), 0 1px 3px rgba(0,0,0,0.3)",
                border: "none",
              }}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                aria-hidden="true"
              />

              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link…
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            <h2
              className="text-foreground mb-2 text-2xl font-semibold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Check Your Email
            </h2>

            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              We've sent a password reset link to your email.
            </p>

            <Button
              asChild
              className="relative w-full overflow-hidden font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(59,130,246,0.4), 0 1px 3px rgba(0,0,0,0.3)",
                border: "none",
              }}
            >
              <Link to="/login">Return to Login</Link>
            </Button>
          </div>
        </>
      )}

      <p className="text-muted-foreground mt-6 text-center text-sm">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
