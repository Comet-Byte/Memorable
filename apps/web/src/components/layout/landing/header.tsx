import ThemeSwitch from "@/components/table-columns/theme-switch";
import { Button } from "@/components/ui/button";
import { CircleOpenArrowRight } from "@/icons";
import { LINKS } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b border-dashed px-4">
      <Link className="flex flex-row items-center gap-2" href={LINKS.HOME}>
        <Image src="/official/logo-icon.png" alt="logo" width={32} height={32} />
        <span className="instrument-serif text-xl font-semibold">Invoicely</span>
      </Link>
      <div className="flex flex-row items-center gap-3">
        <ThemeSwitch />
        <Link href={LINKS.CREATE.INVOICE}>
          <Button variant="secondary">
            <span>Invoice It</span>
            <CircleOpenArrowRight className="text-muted-foreground -rotate-45" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
