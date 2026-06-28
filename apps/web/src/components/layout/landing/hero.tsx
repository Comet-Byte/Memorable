"use client";

import { CircleOpenArrowRight, GithubIcon, Star } from "@/assets/icons";
import { PostHogAnalytics } from "@/components/ui/posthog-analytics";
import { useGithubStars } from "@/hooks/use-github-stars";
import { ScribbledArrowToRight } from "@/assets/svgs";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { LINKS } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  const { stars } = useGithubStars();

  return (
    <div className="relative flex h-[calc(100svh-64px-150px)] flex-row items-center overflow-hidden border-b border-dashed">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          className="h-full min-h-full w-full object-cover object-left invert dark:invert-0"
          src="/official/invoicely-masked-background.png"
          alt="Hero"
          width={1920}
          height={1080}
        />
      </div>
      <div className="z-10 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2 px-6">
          <div className="bg-muted/20 relative flex h-7 w-16 flex-row items-center gap-2 rounded-md border px-2">
            <Star className="size-4 text-yellow-500" />
            <span className="urbanist absolute right-3 text-sm font-semibold">
              <NumberFlow value={stars} />
            </span>
          </div>
          <div className="flex flex-row items-center">
            <div className="bg-muted/20 h-1.5 w-1.5 border"></div>
            <div className="from-muted h-px w-40 bg-gradient-to-r to-transparent"></div>
          </div>
        </div>
        <div className="instrument-serif flex flex-col gap-2 px-6 text-6xl">
          <h1 className="dark:text-primary-foreground/30 text-secondary-foreground/50">
            Create <span className="dark:text-primary-foreground text-secondary-foreground">Beautiful</span> Invoices
          </h1>
          <h2 className="dark:text-primary-foreground/30 text-secondary-foreground/50">
            Not <span className="dark:text-primary-foreground text-secondary-foreground">Ugly</span> Ones
          </h2>
        </div>
        <div className="mt-4 flex flex-row gap-4 px-6">
          <Link href={LINKS.CREATE.INVOICE}>
            <Button>
              <span>Get Started</span>
              <CircleOpenArrowRight className="-rotate-45" />
            </Button>
          </Link>
          <div className="relative">
            <PostHogAnalytics
              analytics={{
                name: "github-open-source-click",
                group: "landing-page",
              }}
            >
              <Link target="_blank" href={LINKS.SOCIALS.GITHUB}>
                <Button variant="secondary">
                  <span>Open Source</span>
                  <GithubIcon />
                </Button>
              </Link>
            </PostHogAnalytics>
            <span className="jetbrains-mono text-muted-foreground/20 pointer-events-none absolute -top-10 left-40 size-full -rotate-[34deg] text-[10px]">
              Give Star <br /> please :3 <br /> for cookie
            </span>
            <ScribbledArrowToRight className="text-muted-foreground/20 pointer-events-none absolute top-2 left-22 size-full rotate-[190deg]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
