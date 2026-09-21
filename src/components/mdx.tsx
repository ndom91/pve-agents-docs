import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

function DocsImage({ alt, className, ...props }: ComponentProps<"img">) {
  const imageAlt = alt ?? "";

  return (
    <ImageZoom
      {...props}
      alt={imageAlt}
      className={["pa-docs-image", className].filter(Boolean).join(" ")}
      rmiz={{
        children: null,
        classDialog: "pa-docs-image-zoom-dialog",
        a11yNameButtonZoom: "Expand image",
        a11yNameButtonUnzoom: "Close image",
      }}
      zoomInProps={{ alt: imageAlt }}
    />
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: DocsImage,
    Tab,
    Tabs,
    Step,
    Steps,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
