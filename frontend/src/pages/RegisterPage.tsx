import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/hooks/auth-hooks";
import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router";

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

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
      await registerMutation.mutateAsync(formData).then(() => navigate("/moderators"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
        <h2 className="mb-6 text-center text-2xl font-semibold">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>

          {registerMutation.isError && (
            <p className="text-sm text-red-500">Registration failed. Please try again.</p>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
