"use client";

import Link from "next/link";

type Lang = "es" | "en";

interface HeaderProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

export default function Header({ lang, onLangChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 backdrop-blur-md"
      style={{ background: "rgba(11,31,58,0.93)" }}>
      <div className="mx-auto max-w-[920px] px-5 flex items-center justify-between h-[60px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #f9c80e 0 33%, #2563eb 33% 66%, #e23b3b 66% 100%)",
            }}
            aria-hidden="true"
          />
          <span className="text-white font-bold tracking-tight text-[15px]">
            Ayuda Venezuela
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-4 text-[13px] font-semibold">
            <Link
              href="/chat"
              className="text-white/75 hover:text-white transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/#developers"
              className="text-white/75 hover:text-white transition-colors"
            >
              {lang === "es" ? "Desarrolladores" : "Developers"}
            </Link>
          </nav>

          {/* Language toggle */}
          <div
          role="group"
          aria-label={lang === "es" ? "Idioma" : "Language"}
          className="inline-flex border border-white/25 rounded-full overflow-hidden"
        >
          {(["es", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => onLangChange(l)}
              className={`px-3 py-1.5 text-[13px] font-semibold cursor-pointer transition-colors ${
                lang === l
                  ? "bg-white text-navy"
                  : "bg-transparent text-white/70 hover:text-white"
              }`}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
          </div>
        </div>
      </div>
    </header>
  );
}
