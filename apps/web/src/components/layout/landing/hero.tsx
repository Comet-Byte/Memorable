"use client";

import { CircleOpenArrowRight } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/constants/links";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center overflow-hidden border-b border-dashed px-6 py-28 text-center sm:py-36">
      {/* Soft ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="bg-muted/30 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
        <span className="bg-primary/80 h-1.5 w-1.5 rounded-full" />
        Invoicing, made memorable
      </div>

      <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
        Create beautiful invoices,
        <br className="hidden sm:block" />
        <span className="text-muted-foreground"> not ugly ones.</span>
      </h1>

      <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed text-balance sm:text-lg">
        Memorable is a fast, private invoice generator. Design polished, professional invoices in minutes — your data
        stays yours.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href={LINKS.CREATE.INVOICE}>
          <Button size="lg" className="gap-2">
            <span>Create an invoice</span>
            <CircleOpenArrowRight className="-rotate-45" />
          </Button>
        </Link>
        <Link href={LINKS.BLOGS}>
          <Button size="lg" variant="secondary">
            Learn more
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
