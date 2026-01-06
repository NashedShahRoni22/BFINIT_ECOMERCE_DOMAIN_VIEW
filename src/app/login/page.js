"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    toast.success("Login coming soon");
  };

  //   const handleKeyPress = (e) => {
  //     if (e.key === "Enter" && !isPending) {
  //       handleLogin();
  //     }
  //   };

  if (loginSuccess) {
    return (
      <div className="bg-muted flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="bg-success/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircle2 className="text-success h-8 w-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Welcome Back!</h2>
            <p className="text-muted-foreground mb-6">
              Login successful. Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Login to your account</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    // onKeyPress={handleKeyPress}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    // disabled={isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="text-muted-foreground hover:text-foreground text-xs hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    // onKeyPress={handleKeyPress}
                    className={`pr-10 pl-10 ${errors.password ? "border-destructive" : ""}`}
                    // disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    // disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="border-destructive/50 bg-destructive/10 rounded-md border p-3">
                  <p className="text-destructive text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleLogin}
                className="w-full"
                size="lg"
                // disabled={isPending}
              >
                Login
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-muted-foreground mt-6 text-center text-sm">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-foreground font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-muted-foreground mt-6 text-center text-xs">
          By logging in, you agree to our{" "}
          <a href="/terms" className="hover:text-foreground underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="hover:text-foreground underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
