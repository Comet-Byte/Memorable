"use client";

import { ChevronsUpDown, InfoIcon, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clientAuth, useSession } from "@/lib/client-auth";
import { usePathname, useRouter } from "next/navigation";
import LogoIcon from "@/components/assets/logo-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { MiniSwitch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@mantine/hooks";
import { env } from "@invoicely/utilities";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export function NavigationUser() {
  const isMounted = useMounted();
  const session = useSession();

  if (session.isPending || !isMounted) {
    return <Skeleton className="h-[142px] w-full" />;
  }

  // if user is null, return a login state
  if (!session.data) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="bg-muted-foreground/5 flex flex-col gap-1 rounded-lg p-4 shadow-xs">
            <div className="instrument-serif font-semibold">Login</div>
            <p className="text-muted-foreground text-xs">
              Login to your account to save your data and access your data anywhere
            </p>
            <LoginButtonModal />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AllowDataSync defaultChecked={session.data.user.allowedSavingData ?? false} />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              variant="dark"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${session.data.user.email}`}
                  alt={session.data.user.name}
                />
                <AvatarFallback className="rounded-lg">L</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight tracking-tight">
                <span className="instrument-sans truncate font-semibold capitalize">{session.data.user.name}</span>
                <span className="jetbrains-mono text-muted-foreground truncate text-xs">{session.data.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${session.data.user.email}`}
                    alt={session.data.user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session.data.user.name}</span>
                  <span className="jetbrains-mono text-muted-foreground truncate text-xs">
                    {session.data.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                clientAuth.signOut();
                session.refetch();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

type AuthMode = "signin" | "signup" | "forgot";

const LoginButtonModal = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupEnabled = env.NEXT_PUBLIC_ENABLE_SIGNUP;

  const handleGoogleLogin = () => {
    setIsDisabled(true);
    clientAuth.signIn.social({
      provider: "google",
      callbackURL: pathname,
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
        callbackURL: `${env.NEXT_PUBLIC_BASE_URL}${pathname}`,
      });
      setIsDisabled(false);
      if (error) {
        toast.error("Sign up failed", { description: error.message });
        return;
      }
      toast.success("Check your email", {
        description: "We sent you a link to verify your email address.",
      });
      setIsOpen(false);
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
    setIsOpen(false);
    router.refresh();
  };

  const titles: Record<AuthMode, string> = {
    signin: "Welcome back!",
    signup: "Create your account",
    forgot: "Reset your password",
  };

  const descriptions: Record<AuthMode, string> = {
    signin: "Login to save your data and access it anywhere",
    signup: "Sign up to save your data and access it anywhere",
    forgot: "Enter your email and we'll send you a reset link",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2.5 w-fit" variant="default" size="xs">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent hideCloseButton>
        <DialogContentContainer className="flex flex-col items-center py-6 text-center">
          <LogoIcon />
          <div>
            <DialogTitle className="instrument-serif text-3xl font-semibold">{titles[mode]}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">{descriptions[mode]}</DialogDescription>
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
      </DialogContent>
    </Dialog>
  );
};

const AllowDataSync = ({ defaultChecked }: { defaultChecked: boolean }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const router = useRouter();

  const handleChange = (checked: boolean) => {
    setIsDisabled(true);

    clientAuth.updateUser({
      allowedSavingData: checked,
      fetchOptions: {
        onSuccess: () => {
          setIsChecked(checked);
          setIsDisabled(false);
          // refetch page
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="bg-muted-foreground/10 mb-2 flex w-full flex-row items-center justify-between rounded-md p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-row items-center justify-between gap-1.5 text-xs">
              Allow Data Sync <InfoIcon className="text-muted-foreground size-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent align="start" sideOffset={6}>
            <p>
              Allow data sync to your account. <br />
              This will allow us to save your data on
              <br /> our servers.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <MiniSwitch disabled={isDisabled} defaultChecked={isChecked} onCheckedChange={handleChange} />
    </div>
  );
};
