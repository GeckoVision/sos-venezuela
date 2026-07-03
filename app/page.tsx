"use client";

import { useState } from "react";
import { translations, type Lang } from "@/lib/i18n";
import Header from "@/components/header";
import Hero from "@/components/hero";
import WhatYouCanAsk from "@/components/what-you-can-ask";
import HowItWorks from "@/components/how-it-works";
import PoweredBy from "@/components/powered-by";
import ApiEndpoints from "@/components/api-endpoints";
import BringYourSource from "@/components/bring-your-source";
import DevHub from "@/components/dev-hub";
import Footer from "@/components/footer";

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");
  const t = translations[lang] as Record<string, string>;

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />
      <main>
        <Hero t={t} />
        <WhatYouCanAsk t={t} />
        <HowItWorks t={t} />
        <PoweredBy t={t} />
        <ApiEndpoints t={t} />
        <DevHub t={t} />
        <BringYourSource t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
