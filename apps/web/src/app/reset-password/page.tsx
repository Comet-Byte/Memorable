"use client";

import { DialogContentContainer } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import LogoIcon from "@/components/assets/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientAuth } from "@/lib/client-auth";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      toast.error("Invalid reset link", { description: "This link is invalid or has expired." });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsDisabled(true);
    const { error } = await clientAuth.resetPassword({ newPassword: password, token });
    setIsDisabled(false);

    if (error) {
      toast.error("Could not reset password", { description: error.message });
      return;
    }

    toast.success("Password updated", { description: "You can now sign in with your new password." });
    router.push("/");
  };

  if (errorParam || !token) {
    return (
      <DialogContentContainer className="flex flex-col items-center gap-3 py-6 text-center">
        <LogoIcon />
        <div>
          <h1 className="instrument-serif text-3xl font-semibold">Invalid or expired link</h1>
          <p className="text-muted-foreground text-sm">Please request a new password reset email.</p>
        </div>
        <Button size="sm" onClick={() => router.push("/")}>
          Back home
        </Button>
      </DialogContentContainer>
    );
  }

  return (
    <DialogContentContainer className="flex flex-col items-center gap-3 py-6 text-center">
      <LogoIcon />
      <div>
        <h1 className="instrument-serif text-3xl font-semibold">Set a new password</h1>
        <p className="text-muted-foreground text-sm">Enter and confirm your new password below.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 text-left">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <Button type="submit" disabled={isDisabled} size="sm" className="mt-1 w-full">
          Reset password
        </Button>
      </form>
    </DialogContentContainer>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
