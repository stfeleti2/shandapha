import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@shandapha/core";
import Link from "next/link";

interface StepCardProps {
  title: string;
  description: string;
  route: string;
  status: "current" | "up-next" | "complete";
}

const statusTheme = {
  current: {
    label: "Current",
    badgeVariant: "default",
  },
  "up-next": {
    label: "Up next",
    badgeVariant: "outline",
  },
  complete: {
    label: "Covered",
    badgeVariant: "secondary",
  },
} as const;

export function StepCard({ title, description, route, status }: StepCardProps) {
  const tone = statusTheme[status];

  return (
    <Link
      href={route}
      className="block text-inherit no-underline"
    >
      <Card
        className={cn(
          "h-full gap-4 transition-colors hover:border-primary/40 hover:bg-accent/30",
          status === "current" && "border-primary/30 bg-accent/20",
        )}
      >
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant={tone.badgeVariant}>{tone.label}</Badge>
            <Badge variant="outline" className="font-mono text-[11px]">
              {route}
            </Badge>
          </div>
          <div className="grid gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="leading-6">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="text-sm font-medium text-primary">Open step</span>
        </CardContent>
      </Card>
    </Link>
  );
}
