export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 rounded-card border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          StayHub
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            StayHub project foundation is ready.
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Next.js, Tailwind CSS, Inter, and shadcn/ui are configured for the
            upcoming product features.
          </p>
        </div>
      </section>
    </main>
  );
}
