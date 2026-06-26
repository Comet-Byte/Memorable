"use client";

import { AnchorProvider, ScrollProvider, TOCItem } from "fumadocs-core/toc";
import { MDXContent } from "@content-collections/mdx/react";
import type { TableOfContents } from "fumadocs-core/server";
import { useEffect, useRef, useState } from "react";
import { blogComponents } from "./components";
import { BlogIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

interface BlogContentProps {
  code: string;
  toc: TableOfContents;
}

export function BlogContent({ code, toc }: BlogContentProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // finding index in toc
            const indexOfToc = toc.findIndex((tocItem) => tocItem.url === `#${entry.target.id}`);

            if (indexOfToc !== -1) {
              setActiveIndex(indexOfToc);
            }
          }
        });
      },
      { rootMargin: "0px 0px -40% 0px" },
    );

    const elements = document.querySelectorAll("h2[id], h3[id]");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [toc]);

  return (
    <div className="relative grid grid-cols-7">
      {/* Content */}
      <div className="col-span-7 space-y-4 border-r border-dashed p-12 md:col-span-5">
        <MDXContent code={code} components={blogComponents} />
      </div>
      {/* Sidebar List of contents */}
      <div className="sticky top-0 hidden h-fit flex-col py-6 pr-6 md:col-span-2 md:flex">
        <div className="text-muted-foreground mb-4 flex flex-row items-center gap-2 pl-6 text-sm">
          <BlogIcon />
          <span className="text-secondary-foreground">On this page</span>
        </div>
        <div className="relative flex h-full flex-row">
          <div className="bg-muted-foreground/70 absolute top-0 -left-px h-full w-px" />
          <AnchorProvider toc={toc}>
            <div ref={viewRef} className="flex h-full flex-col gap-1">
              <ScrollProvider containerRef={viewRef}>
                {toc.map((item, idx) => (
                  <div key={item.url} className="relative flex items-center">
                    {/* Animated vertical line for active item */}
                    <div
                      className="bg-secondary-foreground absolute top-1/2 -left-[1px] h-6 w-[2px] -translate-y-1/2 transition-all duration-300"
                      style={{
                        clipPath: activeIndex === idx ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)", // Hide line when not active
                      }}
                    />
                    <TOCItem
                      className={cn(
                        activeIndex === idx ? "text-secondary-foreground font-semibold" : "text-muted-foreground",
                        "relative z-10 pl-6 text-sm transition-all duration-300",
                      )}
                      href={item.url}
                    >
                      {item.title}
                    </TOCItem>
                  </div>
                ))}
              </ScrollProvider>
            </div>
          </AnchorProvider>
        </div>
      </div>
    </div>
  );
}
