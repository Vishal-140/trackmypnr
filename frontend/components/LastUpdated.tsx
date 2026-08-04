export function LastUpdated({ date }: { date: string }) {
  return (
    <p className="text-sm text-ink-muted">
      Last updated:{" "}
      <time dateTime={date}>
        {new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>
    </p>
  );
}
