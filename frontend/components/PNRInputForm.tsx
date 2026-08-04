"use client";

import { useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { isValidPnr } from "@/lib/utils";

interface PNRInputFormProps {
  onSubmit: (pnrNumber: string) => void | Promise<void>;
  isLoading?: boolean;
}

export function PNRInputForm({ onSubmit, isLoading = false }: PNRInputFormProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
  const isValid = isValidPnr(digitsOnly);
  const showError = touched && value.length > 0 && !isValid;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value.replace(/\D/g, "").slice(0, 10));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid || isLoading) return;
    await onSubmit(digitsOnly);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <label htmlFor="pnr-input" className="mb-2 block text-sm font-medium text-ink">
        Enter your 10-digit PNR number
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            id="pnr-input"
            name="pnr"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 2521703188"
            value={value}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            aria-invalid={showError}
            aria-describedby={showError ? "pnr-input-error" : undefined}
            className={`w-full rounded-xl border bg-surface px-4 py-3.5 text-lg tracking-wide text-ink placeholder:text-ink-muted/60 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-brand ${
              showError ? "border-status-wl" : "border-border focus:border-brand"
            }`}
            style={{ minHeight: 44 }}
          />
          {showError && (
            <p id="pnr-input-error" role="alert" className="mt-1.5 text-sm text-status-wl">
              PNR numbers are exactly 10 digits — you&apos;ve entered {digitsOnly.length}.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          style={{ minHeight: 44, minWidth: 44 }}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-5 w-5" aria-hidden="true" />
          )}
          <span>{isLoading ? "Checking…" : "Track PNR"}</span>
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Your PNR is not stored unless you choose to save it.
      </p>
    </form>
  );
}
