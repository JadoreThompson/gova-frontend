import { type FC, type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
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
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 h-px rounded-b-2xl"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(99,102,241,0.4) 30%, rgba(99,102,241,0.8) 50%, rgba(99,102,241,0.4) 70%, transparent 100%)",
            }}
            aria-hidden="true"
          />
          {children}
        </div>
      </div>
    </div>
  );
};
