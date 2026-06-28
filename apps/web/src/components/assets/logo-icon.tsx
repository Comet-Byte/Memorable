import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      className={cn("h-12 w-12 object-contain", className)}
      src="/official/logo-icon.png"
      alt="logo"
      width={500}
      height={500}
    />
  );
};

export default LogoIcon;
