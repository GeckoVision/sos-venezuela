"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

interface ChatProps {
  t: Record<string, string>;
}

type StagedImage = { mediaType: string; url: string; name: string };

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export default function Chat({ t }: ChatProps) {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const [image, setImage] = useState<StagedImage | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function submit(text: string) {
    const q = text.trim();
    if ((!q && !image) || busy) return;
    if (image) {
      sendMessage({
        role: "user",
        parts: [
          { type: "file", mediaType: image.mediaType, url: image.url },
          { type: "text", text: q || t.chat_photo_default },
        ],
      });
    } else {
      sendMessage({ text: q });
    }
    setInput("");
    setImage(null);
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setImage({
      mediaType: file.type,
      url: await fileToDataUrl(file),
      name: file.name,
    });
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted text-[15px]">{t.chat_empty}</p>
              <div className="flex flex-col gap-2 w-full max-w-[420px]">
                {hints.map((h) => (
                  <button
                    key={h}
                    onClick={() => submit(h)}
                    className="text-left text-[14px] text-navy bg-surface hover:bg-line rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap text-[15px] leading-relaxed rounded-2xl px-4 py-2.5 ${
                  m.role === "user"
                    ? "bg-blue text-white rounded-br-sm"
                    : "bg-surface text-ink rounded-bl-sm"
                }`}
              >
                {m.parts.map((part, i) => {
                  if (part.type === "text")
                    return <span key={i}>{part.text}</span>;
                  if (part.type === "file" && part.mediaType?.startsWith("image/"))
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={part.url}
                        alt={t.chat_photo_alt}
                        className="max-w-[220px] rounded-lg mt-1"
                      />
                    );
                  return null;
                })}
              </div>
            </div>
          ))}

          {status === "submitted" && (
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

        {/* Staged image chip */}
        {image && (
          <div className="border-t border-line px-3 pt-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={t.chat_photo_alt}
              className="w-10 h-10 rounded object-cover"
            />
            <span className="text-[13px] text-muted flex-1 truncate">
              {image.name}
            </span>
            <button
              onClick={() => setImage(null)}
              className="text-muted hover:text-red text-[13px] font-semibold cursor-pointer"
              aria-label={t.chat_remove_photo}
            >
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="border-t border-line p-3 flex gap-2"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-line px-3 text-[18px] text-muted hover:text-navy hover:border-navy/30 transition-colors cursor-pointer"
            aria-label={t.chat_attach_photo}
            title={t.chat_attach_photo}
          >
            📎
          </button>
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
            disabled={busy || (!input.trim() && !image)}
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
