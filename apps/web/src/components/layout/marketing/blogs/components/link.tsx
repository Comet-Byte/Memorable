import { AnchorHTMLAttributes } from "react";
import Link from "next/link";

export function MDXLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <a {...props} />;

  const isExternal = href.startsWith("https://") || href.startsWith("http://");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-primary underline-offset-2 hover:underline"
        {...props}
      />
    );
  }

  return <Link href={href} {...props} />;
}
