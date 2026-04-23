import { PasswordInput } from "@/components/password-input";
import { PasswordRequirements } from "@/components/password-requirements";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/hooks/queries/auth-hooks";
import { Loader2 } from "lucide-react";
import { useRef, useState, type FC, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .refine((val) => (val.match(/[A-Z]/g) || []).length >= 2, {
        message: "Must contain at least 2 uppercase letters",
      })
      .refine((val) => (val.match(/[^\w\s]/g) || []).length >= 2, {
        message: "Must contain at least 2 special characters",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const ResetPasswordPage: FC = () => {
  const navigate = useNavigate();
  const queryParamsRef = useRef(new URLSearchParams(location.search));
  const resetPasswordMutation = useResetPasswordMutation();

  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    special: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(updated);

    const pwd = updated.password;

    setPasswordChecks({
      length: pwd.length >= 8,
      uppercase: (pwd.match(/[A-Z]/g) || []).length >= 2,
      special: (pwd.match(/[^\w\s]/g) || []).length >= 2,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    const code = (queryParamsRef.current.get("code") || "").trim();
    if (!code) {
      setErrorMessage("Invalid or missing reset code.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        code,
        password: formData.password,
      });
      setPasswordUpdated(true);
    } catch {
      setErrorMessage("Unable to reset password. Please try again.");
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
          {/* Bottom shimmer */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-px rounded-b-2xl"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(99,102,241,0.4) 30%, rgba(99,102,241,0.8) 50%, rgba(99,102,241,0.4) 70%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {!passwordUpdated ? (
            <>
              <h2
                className="text-foreground mb-1 text-center text-2xl font-semibold tracking-tight"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                Reset Password
              </h2>

              <p className="text-muted-foreground mb-5 text-center text-sm leading-relaxed">
                Choose a strong new password for your account.
              </p>

              <div
                className="mb-7 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
                }}
              />

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest"
                  >
                    New Password
                  </label>

                  <PasswordInput
                    value={formData.password}
                    onChange={handleChange}
                    disabled={resetPasswordMutation.isPending}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest"
                  >
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={resetPasswordMutation.isPending}
                  />
                </div>

                {/* Password Rules */}
                <PasswordRequirements {...passwordChecks} />

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
                  disabled={resetPasswordMutation.isPending}
                  className="relative w-full overflow-hidden font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
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

                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password…
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <h2
                  className="text-foreground mb-2 text-2xl font-semibold tracking-tight whitespace-nowrap"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}
                >
                  Password Updated
                </h2>

                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  Your password has been successfully reset.
                </p>

                <Button
                  onClick={() => navigate("/login")}
                  className="relative w-full overflow-hidden font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(59,130,246,0.4), 0 1px 3px rgba(0,0,0,0.3)",
                    border: "none",
                  }}
                >
                  Return to Login
                </Button>
              </div>
            </>
          )}

          <p className="text-muted-foreground mt-6 text-center text-sm">
            <Link
              to="/login"
              className="font-medium transition-colors hover:text-blue-300"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
