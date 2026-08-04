export function SkeletonLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Fetching PNR status"
      className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 md:p-8 animate-pulse"
    >
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 rounded-full bg-ink/10" />
        <div className="h-9 w-24 rounded-full bg-ink/10" />
      </div>

      <div className="mt-6 h-4 w-3/4 rounded bg-ink/10" />
      <div className="mt-2 h-3 w-1/2 rounded bg-ink/5" />

      <div className="route-line-h my-6 opacity-30" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-ink/5" />
          <div className="h-4 w-20 rounded bg-ink/10" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-ink/5" />
          <div className="h-4 w-20 rounded bg-ink/10" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-ink/5" />
          <div className="h-4 w-20 rounded bg-ink/10" />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="h-24 w-24 rounded-full bg-ink/5" />
      </div>

      <span className="sr-only">Fetching your PNR status, this usually takes a few seconds…</span>
    </div>
  );
}
