"use client";

import { useEffect, useRef, useState } from "react";

interface ChatProps {
  t: Record<string, string>;
}

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat({ t }: ChatProps) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history = msgs.slice(-8);
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: q, history }),
      });
      const data = (await r.json()) as { reply?: string };
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: data.reply || t.chat_error },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: t.chat_error }]);
    } finally {
      setBusy(false);
    }
  }

  const hints = [t.chat_hint_1, t.chat_hint_2, t.chat_hint_3];

  return (
    <section className="mx-auto max-w-[720px] px-5 py-10 md:py-14">
      <div className="text-center mb-6">
        <h1 className="text-[clamp(24px,4vw,32px)] font-extrabold tracking-tight text-ink">
          {t.chat_title}
        </h1>
        <p className="mt-2 text-muted text-pretty">{t.chat_sub}</p>
      </div>

      <div className="rounded-2xl border border-line bg-card shadow-sm overflow-hidden flex flex-col h-[62vh] min-h-[420px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted text-[15px]">{t.chat_empty}</p>
              <div className="flex flex-col gap-2 w-full max-w-[420px]">
                {hints.map((h) => (
                  <button
                    key={h}
                    onClick={() => ask(h)}
                    className="text-left text-[14px] text-navy bg-surface hover:bg-line rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap text-[15px] leading-relaxed rounded-2xl px-4 py-2.5 ${
                  m.role === "user"
                    ? "bg-blue text-white rounded-br-sm"
                    : "bg-surface text-ink rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="bg-surface text-muted rounded-2xl rounded-bl-sm px-4 py-2.5 text-[15px]">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-subtle animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-subtle animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-subtle animate-pulse [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="border-t border-line p-3 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat_placeholder}
            aria-label={t.chat_placeholder}
            maxLength={1000}
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-[15px] text-ink outline-none focus:border-blue"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-xl bg-blue text-white font-bold px-5 py-2.5 text-[15px] transition-colors hover:bg-blue-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {t.chat_send}
          </button>
        </form>
      </div>

      <p className="mt-3 text-center text-[13px] text-muted">{t.chat_disclaimer}</p>
    </section>
  );
}
