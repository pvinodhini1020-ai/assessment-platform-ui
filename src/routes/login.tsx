import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginIllustration from "@/assets/login-illustration.png";
import { toast } from "sonner";
import { loginApi, saveToken, saveUser, getToken } from "@/lib/api";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (getToken()) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Login" },
      { name: "description", content: "Sign in to your PrepRoute test management account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ userId?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  /** Client-side validation before hitting the API */
  const validate = () => {
    const errs: typeof errors = {};
    if (!userId.trim()) errs.userId = "User ID is required";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation; stop if there are errors
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsLoading(true);
    try {
      // Call POST /auth/login with userId + password
      const res = await loginApi({ userId, password });

      // Persist the JWT token and user object for use across the app
      saveToken(res.data.token);
      saveUser(res.data.user);

      toast.success("Welcome back!");

      // Redirect to dashboard after successful login
      navigate({ to: "/" });
    } catch (err) {
      // Show the server error message (or a fallback) as a toast
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-2">
        {/* Illustration panel */}
        <div className="hidden items-center justify-center bg-accent/50 p-12 lg:flex">
          <img
            src={loginIllustration}
            alt="Illustration of a person working on a laptop"
            width={600}
            height={600}
            className="max-w-md"
          />
        </div>

        {/* Login form panel */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <form onSubmit={submit} className="w-full max-w-sm space-y-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
                P
              </div>
              <span className="text-xl font-bold tracking-tight">
                Prep<span className="text-primary">Route</span>
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Use your company provided login credentials
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  aria-invalid={!!errors.userId}
                  disabled={isLoading}
                />
                {errors.userId && (
                  <p className="text-xs text-destructive">{errors.userId}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>

            {/* Submit — shows loading state while API call is in-flight */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logging in…" : "Login"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link to="/" className="text-primary hover:underline">
                Terms
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
