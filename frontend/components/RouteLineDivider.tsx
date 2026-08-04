export function RouteLineDivider({ className = "" }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`route-line-h w-full ${className}`}
    />
  );
}
