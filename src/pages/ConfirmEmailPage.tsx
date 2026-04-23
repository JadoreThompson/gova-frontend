import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useRequestEmailVerificationMutation,
  useVerifyEmailMutation,
} from "@/hooks/queries/auth-hooks";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";

const RESEND_COOLDOWN_SECONDS = 30;

const ConfirmEmailPage: FC = () => {
  const location = useLocation();
  const [tokenInput, setTokenInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  const queryParamsRef = useRef(new URLSearchParams(location.search));
  const navigate = useNavigate();

  const verifyEmailMutation = useVerifyEmailMutation();
  const requestEmailVerificationMutation =
    useRequestEmailVerificationMutation();

  useEffect(() => {
    const token = queryParamsRef.current.get("token");
    if (token) setTokenInput(token);
  }, [queryParamsRef]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setResendMessage("");

    if (!tokenInput.trim()) {
      setErrorMessage("Please enter a verification code.");
      return;
    }

    verifyEmailMutation
      .mutateAsync({ code: tokenInput })
      .then(() => {
        const next = queryParamsRef.current.get("next");
        if (next?.trim()) {
          next.startsWith("/") ? navigate(next) : window.open(next);
        } else {
          navigate("/moderators");
        }
      })
      .catch(() =>
        setErrorMessage("The provided code is invalid or has expired."),
      );
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || requestEmailVerificationMutation.isPending)
      return;

    setErrorMessage("");
    setResendMessage("");

    requestEmailVerificationMutation
      .mutateAsync()
      .then(() => {
        setResendMessage(
          "A new verification code has been sent to your email.",
        );
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      })
      .catch(() => {
        setErrorMessage(
          "Failed to resend. Please ensure you are logged in if you have an existing account.",
        );
      });
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <h2
        className="mb-1 text-center text-2xl font-semibold tracking-tight whitespace-nowrap text-white"
        style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
      >
        Confirm Your Email
      </h2>
      <p className="text-muted-foreground mb-7 text-center text-sm">
        Enter the verification code sent to your email address.
      </p>

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
            htmlFor="code"
          >
            Verification Code
          </label>
          <Input
            id="code"
            placeholder="Paste your code here"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            disabled={verifyEmailMutation.isPending}
            required
            className="bg-background placeholder:text-muted-foreground/40 focus-visible:ring-0"
          />
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

        {resendMessage && (
          <p
            className="rounded-lg border px-3.5 py-2.5 text-sm"
            style={{
              background: "rgba(16,185,129,0.1)",
              borderColor: "rgba(16,185,129,0.25)",
              color: "#6ee7b7",
            }}
          >
            {resendMessage}
          </p>
        )}

        <Button
          type="submit"
          className="relative w-full overflow-hidden font-semibold text-white"
          disabled={verifyEmailMutation.isPending}
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
          {verifyEmailMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Confirm Email"
          )}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Didn't receive a code?{" "}
        <Button
          variant="link"
          type="button"
          onClick={handleResend}
          disabled={
            resendCooldown > 0 || requestEmailVerificationMutation.isPending
          }
          className="text-muted-foreground disabled:text-muted-foreground/50 h-auto !bg-transparent p-0 text-sm font-medium transition-colors hover:text-blue-300 disabled:cursor-not-allowed"
        >
          {requestEmailVerificationMutation.isPending
            ? "Sending…"
            : resendCooldown > 0
              ? `Resend again in ${resendCooldown}s`
              : "Resend email"}
        </Button>
      </p>
    </AuthLayout>
  );
};

export default ConfirmEmailPage;
