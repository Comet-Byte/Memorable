import { GenerateBreadcrumb } from "@/components/ui/generate-breadcrumb";
import { allBlogs } from "content-collections";
import { cn } from "@/lib/utils";
import React from "react";

interface BlogHeroProps {
  blog?: (typeof allBlogs)[number];
  title?: string;
  description?: string;
  isBlogsPage?: boolean;
}

const BlogHero = ({ blog, title, description, isBlogsPage = false }: BlogHeroProps) => {
  return (
    <div className="h-96 border-b border-dashed p-4">
      <div
        className={cn(
          isBlogsPage ? "bg-black/100" : "bg-black/60",
          "bg-cover bg-center bg-no-repeat bg-blend-overlay",
          "relative h-full overflow-hidden rounded-lg",
        )}
        style={{
          backgroundImage: `url(${blog?.thumbnail})`,
        }}
      >
        <BlogGradientFilters />
        <div className="flex h-full flex-col justify-between p-8">
          <div className="jetbrains-mono">
            <GenerateBreadcrumb />
          </div>
          <div className="text-primary-foreground flex flex-col">
            <h1 className="instrument-serif text-4xl font-bold md:text-5xl">{title || blog?.title}</h1>
            <p className="text-primary-foreground/70 text-xs sm:text-sm">{description || blog?.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;

const BlogGradientFilters = () => {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  );
};
