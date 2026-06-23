"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MAX_CHARS = 500;
const SUPPORT_EMAIL = "support@watch.fun";

/**
 * Contact Us modal — a short support form (email + problem description) over
 * the shared glass-card modal chrome. With no backend, submitting opens the
 * user's mail client prefilled to support. Close via the X, backdrop, or Esc.
 */
export function ContactModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const canSend = /\S+@\S+\.\S+/.test(email) && message.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    const body = `${message}\n\nReply to: ${email}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      "Support request",
    )}&body=${encodeURIComponent(body)}`;
    onClose();
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 normal-case lg:items-center lg:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="legal-modal"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(248,239,211,0.15)] text-[#e8dccb] transition-[background-color,transform] duration-200 ease-[ease] hover:bg-[rgba(248,239,211,0.25)] hover:[transform:scale(1.05)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </button>

        <div className="px-12 text-center">
          <h2 id="contact-modal-title" className="text-[28px] text-cream">
            Contact us
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us what&apos;s going on — we&apos;ll reply by email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="contact-email">Your email</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              className="h-11 text-base"
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="contact-message">Describe your problem</FieldLabel>
              <span className="text-xs tabular-nums text-muted-foreground">
                {message.length}/{MAX_CHARS}
              </span>
            </div>
            <Textarea
              id="contact-message"
              value={message}
              maxLength={MAX_CHARS}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What happened?"
              className="min-h-28 resize-none text-base"
            />
          </Field>

          <Button type="submit" disabled={!canSend} className="mt-2 h-11">
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
}
