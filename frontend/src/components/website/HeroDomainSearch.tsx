"use client";

import { FormEvent, useEffect, useState } from "react";

const PLACEHOLDERS = [
  "Enter your domain name...",
  "yourbusiness.com",
  "mybrand.so",
  "startup.io",
];

export default function HeroDomainSearch() {
  const [domain, setDomain] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (domain || isFocused) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = PLACEHOLDERS[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        setPlaceholder(phrase.slice(0, charIndex));

        if (charIndex === phrase.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1800);
          return;
        }

        timeoutId = setTimeout(tick, 70);
        return;
      }

      charIndex -= 1;
      setPlaceholder(phrase.slice(0, charIndex));

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % PLACEHOLDERS.length;
        timeoutId = setTimeout(tick, 400);
        return;
      }

      timeoutId = setTimeout(tick, 40);
    };

    timeoutId = setTimeout(tick, 400);

    return () => clearTimeout(timeoutId);
  }, [domain, isFocused]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      className="flex items-center w-[min(100%,650px)] min-h-[58px] mx-auto mt-[26px] px-[18px] py-[5px] pr-[6px] border border-[color-mix(in_srgb,#116cc6_22%,var(--border))] rounded-full bg-[color-mix(in_srgb,white_78%,transparent)] shadow-[0_14px_35px_rgba(10,40,74,0.11)] backdrop-blur-[12px] dark:border-white/[0.13] dark:bg-[rgba(5,15,32,0.78)] dark:shadow-[0_14px_35px_rgba(0,0,0,0.18)] max-[480px]:grid max-[480px]:grid-cols-[auto_1fr] max-[480px]:p-[7px] max-[480px]:rounded-[18px]"
      onSubmit={submitSearch}
      aria-label="Search for a domain"
    >
      <span className="pr-4 border-r border-[var(--border)] text-[#116cc6] text-[14px] dark:text-[#ffbc11] max-[480px]:px-[10px]">
        www.
      </span>
      <label className="sr-only" htmlFor="hero-domain-name">
        Enter your domain name
      </label>
      <input
        id="hero-domain-name"
        className="min-w-0 flex-1 h-[46px] px-4 border-0 outline-0 bg-transparent text-[var(--foreground)] text-[14px] placeholder:text-[var(--muted)] max-[480px]:px-[10px]"
        value={domain}
        onChange={(event) => setDomain(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || "Enter your domain name..."}
        autoComplete="off"
      />
      <button
        className="flex items-center justify-center gap-2 min-w-[126px] min-h-[46px] px-5 border-0 rounded-full bg-[#116cc6] text-white font-bold cursor-pointer transition-all duration-180 hover:bg-[#0b559e] hover:scale-[1.02] dark:bg-[#ffbc11] dark:text-[#122035] max-[480px]:col-span-2 max-[480px]:w-full max-[480px]:mt-[5px]"
        type="submit"
      >
        <svg
          className="w-[18px] h-[18px] fill-none stroke-current"
          style={{ strokeWidth: 2, strokeLinecap: "round" } as React.CSSProperties}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        Search
      </button>
    </form>
  );
}
