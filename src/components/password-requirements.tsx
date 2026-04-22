import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  special: boolean;
}

export const PasswordRequirements: React.FC<PasswordChecks> = (
  passwordChecks: PasswordChecks,
) => {
  return (
    <div>
      <ul>
        <li
          className={cn(
            "flex items-center justify-start gap-3",
            passwordChecks.length ? "text-green-500" : "text-muted-foreground",
          )}
        >
          <Check size={15} color={passwordChecks.length ? "green" : "gray"} />
          <span className="text-xs">At least 8 characters</span>
        </li>
        <li
          className={cn(
            "flex items-center justify-start gap-3",
            passwordChecks.uppercase
              ? "text-green-500"
              : "text-muted-foreground",
          )}
        >
          <Check
            size={15}
            color={passwordChecks.uppercase ? "green" : "gray"}
          />
          <span className="text-xs">2 uppercase characters</span>
        </li>
        <li
          className={cn(
            "flex items-center justify-start gap-3",
            passwordChecks.special ? "text-green-500" : "text-muted-foreground",
          )}
        >
          <Check size={15} color={passwordChecks.special ? "green" : "gray"} />
          <span className="text-xs">2 special characters</span>
        </li>
      </ul>
    </div>
  );
};
