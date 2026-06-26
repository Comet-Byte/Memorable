import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";
import { cn } from "@/lib/utils";

export const Code = ({ ...props }) => {
  return (
    <CodeBlock
      {...props}
      className={cn(
        props.className,
        "-mx-12 my-12 rounded-none border-x-0 border-b-0 border-dashed !bg-transparent",
        "[&>div]:first-of-type:!text-primary [&>div]:first-of-type:border-b [&>div]:first-of-type:border-dashed [&>div]:first-of-type:bg-transparent",
      )}
    >
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
};
