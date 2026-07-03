// Web chat backend on the Vercel AI SDK — streaming, multimodal, and it dogfoods our
// own product: instead of hand-writing integration code, Claude connects to our HOSTED
// Gecko MCP (comprehended humanitarian tools) via the native MCP connector, calls the
// real APIs, and streams the answer back. We never store the responses.
//
// Guardrails: a public chat burns per-message spend, so we bound it — per-IP sliding
// window + a per-instance daily ceiling + Haiku. Counters are in-memory (reset on cold
// start), so they're a deterrent, not a hard global cap; a shared KV is the upgrade.
// Requires ANTHROPIC_API_KEY in the env (the @ai-sdk/anthropic provider reads it).

import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { MODEL, providerOptions, SYSTEM } from "@/lib/agent";

export const runtime = "nodejs";
export const maxDuration = 30;

const PER_IP_PER_MIN = 6;
const GLOBAL_PER_DAY = 3000;

const ipHits = new Map<string, number[]>();
let dayKey = "";
let dayCount = 0;

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? "unknown").trim();
}

function perIpOk(ip: string, now: number): boolean {
  const win = (ipHits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (win.length >= PER_IP_PER_MIN) {
    ipHits.set(ip, win);
    return false;
  }
  win.push(now);
  ipHits.set(ip, win);
  return true;
}

function globalOk(today: string): boolean {
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  if (dayCount >= GLOBAL_PER_DAY) return false;
  dayCount++;
  return true;
}

function textError(msg: string, status = 200): Response {
  // Return the message as a plain-text UI stream chunk so useChat renders it.
  return new Response(`0:${JSON.stringify(msg)}\n`, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return textError("El chat no está configurado todavía. Intenta más tarde.");
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return textError("No pude leer tu mensaje. Intenta de nuevo.");
  }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (messages.length === 0) {
    return textError("Escríbeme una pregunta para empezar.");
  }

  const now = Date.now();
  if (!perIpOk(clientIp(req), now)) {
    return textError(
      "Estás enviando muchas preguntas muy rápido. Espera unos segundos, por favor. 🙏",
    );
  }
  if (!globalOk(new Date().toISOString().slice(0, 10))) {
    return textError(
      "El chat está muy solicitado ahora mismo. Intenta más tarde, o por Telegram (@DEV_VEZbot).",
    );
  }

  const result = streamText({
    model: anthropic(MODEL),
    system: SYSTEM,
    messages: await convertToModelMessages(messages),
    // Native MCP connector → our hosted comprehended surface (shared with the
    // Telegram webhook). Claude runs the tool loop server-side.
    providerOptions,
  });

  return result.toUIMessageStreamResponse();
}
