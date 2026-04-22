import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const PasswordInput = (
  props: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "type"
  >,
) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-input/30 border-input mb-1 flex rounded-md border-1">
      <Input
        id={props.id || "password"}
        name={props.name || "password"}
        type={showPassword ? "text" : "password"}
        placeholder={props.placeholder || "••••••••"}
        required={props.required ?? true}
        className={
          props.className || "border-0 !bg-transparent focus-visible:ring-0"
        }
        {...props}
      />

      <Button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        variant={"ghost"}
        className="text-muted-foreground hover:text-foreground aspect-square !bg-transparent !p-1 hover:!bg-transparent focus:!outline-none"
        onMouseUp={() => setShowPassword(!showPassword)}
        onTouchEnd={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" color="red" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
