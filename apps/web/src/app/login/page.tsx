"use client";

import { DialogContentContainer } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import LogoIcon from "@/components/assets/logo-icon";
import { Suspense, useEffect, useState } from "react";
import { clientAuth, useSession } from "@/lib/client-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@invoicely/utilities";
import Image from "next/image";
import { toast } from "sonner";

type AuthMode = "signin" | "signup" | "forgot";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const redirect = searchParams.get("redirect") || "/invoices";

  const [mode, setMode] = useState<AuthMode>("signin");
  const [isDisabled, setIsDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupEnabled = env.NEXT_PUBLIC_ENABLE_SIGNUP;

  // Already authenticated — bounce to the intended destination.
  useEffect(() => {
    if (session) {
      router.replace(redirect);
    }
  }, [session, redirect, router]);

  const handleGoogleLogin = () => {
    setIsDisabled(true);
    clientAuth.signIn.social({
      provider: "google",
      callbackURL: `${env.NEXT_PUBLIC_BASE_URL}${redirect}`,
    });
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsDisabled(true);

    if (mode === "signup") {
      const { error } = await clientAuth.signUp.email({
        name,
        email,
        password,
        callbackURL: `${env.NEXT_PUBLIC_BASE_URL}${redirect}`,
      });
      setIsDisabled(false);
      if (error) {
        toast.error("Sign up failed", { description: error.message });
        return;
      }
      toast.success("Check your email", {
        description: "We sent you a link to verify your email address.",
      });
      setMode("signin");
      return;
    }

    if (mode === "forgot") {
      const { error } = await clientAuth.requestPasswordReset({
        email,
        redirectTo: `${env.NEXT_PUBLIC_BASE_URL}/reset-password`,
      });
      setIsDisabled(false);
      if (error) {
        toast.error("Could not send reset email", { description: error.message });
        return;
      }
      toast.success("Check your email", {
        description: "If an account exists, a password reset link is on its way.",
      });
      setMode("signin");
      return;
    }

    // signin
    const { error } = await clientAuth.signIn.email({ email, password });
    setIsDisabled(false);
    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return;
    }
    router.replace(redirect);
    router.refresh();
  };

  const titles: Record<AuthMode, string> = {
    signin: "Welcome back!",
    signup: "Create your account",
    forgot: "Reset your password",
  };

  const descriptions: Record<AuthMode, string> = {
    signin: "Login to access your dashboard",
    signup: "Sign up to access your dashboard",
    forgot: "Enter your email and we'll send you a reset link",
  };

  return (
    <DialogContentContainer className="flex flex-col items-center gap-3 py-6 text-center">
      <LogoIcon />
      <div>
        <h1 className="instrument-serif text-3xl font-semibold">{titles[mode]}</h1>
        <p className="text-muted-foreground text-sm">{descriptions[mode]}</p>
      </div>

      <form onSubmit={handleEmailSubmit} className="mt-2 flex w-full flex-col gap-2 text-left">
        {mode === "signup" && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {mode !== "forgot" && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        )}
        <Button type="submit" disabled={isDisabled} size="sm" className="mt-1 w-full">
          {mode === "signin" && "Sign in"}
          {mode === "signup" && "Sign up"}
          {mode === "forgot" && "Send reset link"}
        </Button>
      </form>

      <div className="text-muted-foreground flex w-full flex-col gap-1 text-xs">
        {mode === "signin" && (
          <>
            <button type="button" className="cursor-pointer hover:underline" onClick={() => setMode("forgot")}>
              Forgot password?
            </button>
            {signupEnabled && (
              <button type="button" className="cursor-pointer hover:underline" onClick={() => setMode("signup")}>
                Don&apos;t have an account? Sign up
              </button>
            )}
          </>
        )}
        {(mode === "signup" || mode === "forgot") && (
          <button type="button" className="cursor-pointer hover:underline" onClick={() => setMode("signin")}>
            Back to sign in
          </button>
        )}
      </div>

      <div className="flex w-full items-center gap-2">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <button disabled={isDisabled} className="cursor-pointer" onClick={handleGoogleLogin}>
        <Image
          className="dark:hidden"
          src="/social/google-login-btn-light.svg"
          alt="Google Login"
          width={200}
          height={40}
          priority
        />
        <Image
          className="hidden dark:block"
          src="/social/google-login-btn-dark.svg"
          alt="Google Login"
          width={200}
          height={40}
          priority
        />
      </button>
    </DialogContentContainer>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
