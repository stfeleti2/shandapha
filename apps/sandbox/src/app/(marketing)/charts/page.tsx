import Link from "next/link";

export default function ChartsPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col justify-center gap-6 px-6 py-20">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Deferred
      </span>
      <div className="grid gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Charts are intentionally out of the active Shandapha surface right
          now.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Phase 3 keeps charts silent until there is a real install path with
          proof. The current registry truth focuses on installable templates,
          packs, modules, and portability seams instead of placeholder breadth.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-full border px-4 py-2 text-sm font-medium"
          href="/directory"
        >
          Browse installable items
        </Link>
        <Link
          className="rounded-full border px-4 py-2 text-sm font-medium"
          href="/templates"
        >
          View real templates
        </Link>
      </div>
    </main>
  );
}
