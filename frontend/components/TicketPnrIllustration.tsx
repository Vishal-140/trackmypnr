export function TicketPnrIllustration() {
  return (
    <svg
      viewBox="0 0 480 220"
      role="img"
      aria-label="Diagram of a railway e-ticket showing the PNR number printed at the top left corner, above the passenger name and train details"
      className="h-auto w-full max-w-md"
    >
      <title>PNR number location on a railway e-ticket</title>
      <rect x="4" y="4" width="472" height="212" rx="16" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
      <rect x="4" y="4" width="472" height="44" rx="16" fill="var(--color-brand)" />
      <rect x="4" y="34" width="472" height="14" fill="var(--color-brand)" />
      <text x="24" y="32" fill="white" fontFamily="var(--font-display)" fontSize="16" fontWeight="700">
        Indian Railways E-Ticket
      </text>

      <rect x="24" y="66" width="180" height="34" rx="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="34" y="80" fill="var(--color-ink-muted)" fontFamily="var(--font-body)" fontSize="10" fontWeight="600">
        PNR NUMBER
      </text>
      <text x="34" y="94" fill="var(--color-ink)" fontFamily="var(--font-display)" fontSize="14" fontWeight="700">
        2521703188
      </text>

      <line x1="24" y1="118" x2="456" y2="118" stroke="var(--color-border)" strokeWidth="1" />

      <text x="24" y="140" fill="var(--color-ink-muted)" fontFamily="var(--font-body)" fontSize="11">
        Passenger: A SHARMA · Coach HA1 · Berth 2 (UB)
      </text>
      <text x="24" y="160" fill="var(--color-ink-muted)" fontFamily="var(--font-body)" fontSize="11">
        Train 20962 · BNRS → UJN · Class 2A
      </text>
      <text x="24" y="180" fill="var(--color-ink-muted)" fontFamily="var(--font-body)" fontSize="11">
        Date of Journey: 12 Aug 2026
      </text>

      <path
        d="M210 83 C 250 60, 260 40, 300 30"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent)" />
        </marker>
      </defs>
    </svg>
  );
}
