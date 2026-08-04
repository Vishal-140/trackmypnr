"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Search, Loader2, Clock, Trash2 } from "lucide-react";
import { isValidPnr } from "@/lib/utils";

const HISTORY_KEY = "trackmypnr_search_history";

interface PNRInputFormProps {
  onSubmit: (pnrNumber: string) => void | Promise<void>;
  isLoading?: boolean;
  initialValue?: string;
}

export function PNRInputForm({
  onSubmit,
  isLoading = false,
  initialValue = "",
}: PNRInputFormProps) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.filter((item) => typeof item === "string" && isValidPnr(item)).slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  function saveToHistory(pnr: string) {
    try {
      const updated = [pnr, ...history.filter((h) => h !== pnr)].slice(0, 5);
      setHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }

  function handleClearHistory() {
    try {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }

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
    saveToHistory(digitsOnly);
    await onSubmit(digitsOnly);
  }

  async function handleHistoryClick(pnr: string) {
    setValue(pnr);
    setTouched(false);
    saveToHistory(pnr);
    await onSubmit(pnr);
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

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          Your PNR is not stored unless you choose to save it.
        </p>

        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs font-medium text-ink-muted">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Recent:
            </span>
            {history.map((pnr) => (
              <button
                key={pnr}
                type="button"
                onClick={() => handleHistoryClick(pnr)}
                className="inline-flex items-center rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-xs font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                title={`Track PNR ${pnr}`}
              >
                {pnr}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearHistory}
              className="ml-1 text-xs text-ink-muted hover:text-status-wl"
              title="Clear search history"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

