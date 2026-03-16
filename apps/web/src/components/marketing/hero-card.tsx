import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shandapha/core";
import { Inline, Stack } from "@shandapha/layouts";

interface HeroCardProps {
  eyebrow: string;
  title: string;
  body: string;
  highlights: string[];
  ctaLabel: string;
}

export function HeroCard({
  eyebrow,
  title,
  body,
  highlights,
  ctaLabel,
}: HeroCardProps) {
  return (
    <article className="h-full">
      <Card className="h-full justify-between gap-5">
        <CardHeader className="gap-3">
          <Badge variant="outline">{eyebrow}</Badge>
          <Stack gap={8}>
            <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
            <CardDescription className="max-w-prose text-base leading-7">
              {body}
            </CardDescription>
          </Stack>
        </CardHeader>
        <CardContent className="pt-0">
          <Inline gap={8}>
            {highlights.map((highlight) => (
              <Badge key={highlight} variant="secondary">
                {highlight}
              </Badge>
            ))}
          </Inline>
        </CardContent>
        <CardFooter className="pt-0">
          <Button type="button">{ctaLabel}</Button>
        </CardFooter>
      </Card>
    </article>
  );
}
