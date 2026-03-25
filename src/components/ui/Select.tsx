"use client";

import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  sublabel?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  size = "md",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3 py-2 text-sm";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 rounded-xl border border-border bg-surface-2 ${pad} text-left transition-colors hover:border-accent/40 focus:border-accent focus:outline-none ${
          !selected ? "text-muted" : "text-text"
        }`}
      >
        {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
        <span className="min-w-0 flex-1 truncate">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-border bg-surface shadow-lg"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 ${pad} text-left transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-text hover:bg-surface-2"
                  }`}
                >
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="block truncate text-[11px] text-muted">
                        {opt.sublabel}
                      </span>
                    )}
                  </span>
                  {active && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
            {options.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted">
                No options available
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
