"use client";

import {
  Badge,
  Button,
  CardDescription,
  CardTitle,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from "@shandapha/core";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  TerminalSquareIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

function legacyCopy(value: string) {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, value.length);

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textArea);
  return copied;
}

async function copyToClipboard(value: string) {
  if (typeof window === "undefined" || !value) {
    return false;
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return legacyCopy(value);
    }
  }

  return legacyCopy(value);
}

function CopyCodeButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      type="button"
      data-slot="copy-button"
      size="icon-sm"
      variant="ghost"
      className={cn(
        "absolute right-2 z-10 size-7 bg-code text-code-foreground shadow-none hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      onClick={async () => {
        const hasCopied = await copyToClipboard(value);

        if (hasCopied) {
          setCopied(true);
        }
      }}
    >
      <span className="sr-only">Copy code</span>
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
    </Button>
  );
}

export function CodeBlock({
  title,
  language = "tsx",
  code,
  className,
  maxHeightClassName = "max-h-96",
  showLineNumbers,
  lineClassName,
}: {
  title?: string;
  language?: string;
  code: string;
  className?: string;
  maxHeightClassName?: string;
  showLineNumbers?: boolean;
  lineClassName?: (line: string, index: number) => string | undefined;
}) {
  const lines = useMemo(() => {
    const normalized = code.endsWith("\n") ? code.slice(0, -1) : code;
    return normalized.split("\n");
  }, [code]);

  const shouldShowLineNumbers = showLineNumbers ?? lines.length > 1;

  return (
    <figure
      data-rehype-pretty-code-figure=""
      className={cn("relative", className)}
    >
      {title ? (
        <figcaption
          data-rehype-pretty-code-title=""
          data-language={language}
          className="flex items-center gap-2 pr-12"
        >
          <TerminalSquareIcon className="size-4 opacity-70" />
          {title}
        </figcaption>
      ) : null}
      <CopyCodeButton value={code} className={title ? "top-3" : "top-2"} />
      <ScrollArea className={cn("w-full", maxHeightClassName)}>
        <pre
          data-language={language}
          data-line-numbers={shouldShowLineNumbers ? "" : undefined}
          className="overflow-x-auto p-4 text-sm leading-6 text-code-foreground"
        >
          <code>
            {lines.map((line, index) => (
              <span
                key={`${language}-${index}-${line}`}
                data-line=""
                className={cn(lineClassName?.(line, index))}
              >
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </ScrollArea>
    </figure>
  );
}

export function ComponentPreviewCard({
  title,
  description,
  owner,
  installTarget,
  sourceName,
  preview,
  code,
  previewClassName,
  badge,
}: {
  title: string;
  description: string;
  owner: string;
  installTarget: string;
  sourceName: string;
  preview: ReactNode;
  code: string;
  previewClassName?: string;
  badge?: string;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-background">
      <div className="grid gap-4 border-b px-6 py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {badge ? <Badge variant="outline">{badge}</Badge> : null}
            </div>
            <CardDescription className="max-w-2xl leading-6">
              {description}
            </CardDescription>
          </div>
          <div className="rounded-md border bg-muted/30 px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
            {owner}
          </div>
        </div>
        <code className="font-mono text-xs text-muted-foreground">
          {installTarget}
        </code>
      </div>
      <Tabs defaultValue="preview" className="gap-0">
        <div className="flex items-center justify-between border-b px-4">
          <TabsList
            variant="line"
            className="-mb-px h-11 gap-0 rounded-none p-0"
          >
            <TabsTrigger value="preview" className="rounded-none px-3.5">
              <EyeIcon className="size-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-none px-3.5">
              <TerminalSquareIcon className="size-4" />
              Code
            </TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="hidden md:inline-flex">
            Local source
          </Badge>
        </div>
        <TabsContent value="preview" className="m-0">
          <div
            className={cn(
              "preview relative flex min-h-[320px] w-full items-center justify-center bg-background p-8 md:p-10",
              previewClassName,
            )}
          >
            {preview}
          </div>
        </TabsContent>
        <TabsContent value="code" className="m-0">
          <CodeBlock title={sourceName} code={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
