"use client";

import { useState } from "react";
import { translations, type Lang } from "@/lib/i18n";
import Header from "@/components/header";
import Chat from "@/components/chat";
import Footer from "@/components/footer";

export default function ChatPage() {
  const [lang, setLang] = useState<Lang>("es");
  const t = translations[lang] as Record<string, string>;

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />
      <main className="bg-bg min-h-[70vh]">
        <Chat t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
