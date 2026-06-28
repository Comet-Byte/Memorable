import { defineCollection, defineConfig } from "@content-collections/core";
import { remarkHeading } from "fumadocs-core/mdx-plugins";
import { rehypeCode } from "fumadocs-core/mdx-plugins";
import { compileMDX } from "@content-collections/mdx";

// https://www.content-collections.dev/docs/configuration

const writings = defineCollection({
  name: "blogs",
  directory: "src/content/blogs",
  include: "*.mdx",
  schema: (z) => ({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    thumbnail: z.string(),
    ogImage: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        [
          rehypeCode,
          {
            themes: {
              light: "min-light",
              dark: "min-dark",
            },
          },
        ],
      ],
      remarkPlugins: [remarkHeading],
    });
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [writings],
});
