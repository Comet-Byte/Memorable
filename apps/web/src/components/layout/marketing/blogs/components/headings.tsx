import { cn } from "@/lib/utils";
import React from "react";

// Types for MDX content
interface MDXElementProps {
  src?: string;
  children?: React.ReactNode;
  id?: string;
  [key: string]: unknown;
}

const HeadingTwo = ({ id, ...props }: MDXElementProps) => {
  return <h2 id={id} {...props} className="instrument-serif text-3xl font-semibold" />;
};

const HeadingThree = ({ id, ...props }: MDXElementProps) => {
  return <h3 id={id} {...props} className="instrument-serif text-xl font-semibold" />;
};

// Custom paragraph component that handles images
const Paragraph = (props: React.HTMLAttributes<HTMLParagraphElement>) => {
  const childrenArray = React.Children.toArray(props.children);

  if (childrenArray.length === 1) {
    const onlyChild = childrenArray[0];

    if (React.isValidElement(onlyChild)) {
      if (onlyChild.type === "img" || typeof (onlyChild.props as MDXElementProps)?.src === "string") {
        return <>{props.children}</>;
      }
    }
  }

  // render normal paragraph
  return (
    <p
      {...props}
      className={cn(
        "text-secondary-foreground/70 text-base text-[15px] font-light",
        // Code tag inside paragraph
        "[&>code]:bg-secondary-foreground/10 [&>code]:rounded-sm [&>code]:border [&>code]:px-1 [&>code]:text-xs",
      )}
    />
  );
};

export { HeadingTwo, HeadingThree, Paragraph };
