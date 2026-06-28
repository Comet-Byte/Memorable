import { Button } from "@/components/ui/button";
import { BlogIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogHeader = ({ link, label }: { link: string; label: string }) => {
  return (
    <div className="flex h-16 items-center justify-between border-b border-dashed px-4">
      <Link className="flex flex-row items-center gap-2" href={link}>
        <Image src="/official/logo-icon.png" alt="logo" width={32} height={32} />
        <span className="instrument-serif text-xl font-semibold">Invoicely</span>
      </Link>
      <div className="flex flex-row items-center gap-2">
        <Link href={link}>
          <Button variant="secondary">
            <BlogIcon />
            <span>{label}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogHeader;
