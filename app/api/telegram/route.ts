// Telegram webhook — the SAME agent as the web chat, served serverless on Vercel so
// @DEV_VEZbot needs no host and auto-deploys on push. Telegram POSTs each Update here;
// we answer text / commands / a shared location (nearest center) / a shared photo
// (missing-person search), and reply via the Bot API. Retires the Python long-poll bot.
//
// Env: TELEGRAM_BOT_TOKEN (required), ANTHROPIC_API_KEY (the agent), optional
// TELEGRAM_WEBHOOK_SECRET (if set, must match the header Telegram sends).

import type { ModelMessage } from "ai";
import { askAgent } from "@/lib/agent";
import { fetchCentros, nearestHelpReply } from "@/lib/geo";
import { getFileDataUrl, sendChatAction, sendMessage } from "@/lib/telegram";

export const runtime = "nodejs";
export const maxDuration = 30;

const PER_CHAT_PER_MIN = 8;
const chatHits = new Map<number, number[]>();

function rateOk(chatId: number, now: number): boolean {
  const win = (chatHits.get(chatId) ?? []).filter((t) => now - t < 60_000);
  if (win.length >= PER_CHAT_PER_MIN) {
    chatHits.set(chatId, win);
    return false;
  }
  win.push(now);
  chatHits.set(chatId, win);
  return true;
}

const WELCOME =
  "Soy el asistente de Ayuda Venezuela. Pregúntame en lenguaje normal: «¿está " +
  "reportada María Pérez?», «¿cuántos desaparecidos hay?», o comparte una foto de " +
  "una persona para buscarla. Para centros de acopio cercanos, comparte tu ubicación " +
  "(📎). Datos públicos, gratis. Emergencias: 171.";
const HELP =
  "Escríbeme en lenguaje normal, o usa:\n" +
  "/buscar <nombre> — buscar una persona\n" +
  "/cifras — desaparecidos y encontrados\n" +
  "/cerca — centros de acopio más cercanos (comparte tu ubicación 📎)\n\n" +
  "También puedes enviarme una foto de una persona para buscarla. Emergencias: 171.";
const CERCA_PROMPT =
  "Para darte los centros de acopio más cercanos, comparte tu ubicación: toca el clip " +
  "📎 → «Ubicación» → «Enviar mi ubicación actual».";
const BUSCAR_PROMPT = "Escribe el nombre, por ejemplo:\n/buscar María Pérez";
const RATE =
  "Estás enviando muchas preguntas muy rápido. Espera unos segundos, por favor. 🙏";
const FALLBACK = "No pude responder ahora mismo. Intenta de nuevo en un momento.";

const COMMAND_QUERIES: Record<string, string> = {
  cifras:
    "Dame las cifras agregadas: cuántas personas desaparecidas y cuántas encontradas.",
  reportes:
    "Muéstrame los reportes recientes del mapa de peligros (edificios colapsados, " +
    "refugios, agua, puntos de ayuda) y resume los más relevantes.",
  noticias: "Dame las últimas noticias verificadas del terremoto.",
};

/** Resolve a /command to a static reply or an agent query. */
function resolveCommand(
  cmd: string,
  arg: string,
): { reply?: string; query?: string } {
  const c = cmd.replace(/^\//, "").split("@")[0].toLowerCase();
  if (c === "start") return { reply: WELCOME };
  if (c === "ayuda" || c === "help") return { reply: HELP };
  if (c === "cerca") return { reply: CERCA_PROMPT };
  if (c === "buscar")
    return arg.trim()
      ? { query: `Busca personas reportadas con el nombre: ${arg.trim()}` }
      : { reply: BUSCAR_PROMPT };
  if (c in COMMAND_QUERIES) return { query: COMMAND_QUERIES[c] };
  return { reply: HELP };
}

interface TgMessage {
  chat: { id: number };
  text?: string;
  caption?: string;
  location?: { latitude: number; longitude: number };
  photo?: Array<{ file_id: string }>;
}

async function handle(msg: TgMessage): Promise<void> {
  const chatId = msg.chat.id;
  if (!rateOk(chatId, Date.now())) {
    await sendMessage(chatId, RATE);
    return;
  }
  await sendChatAction(chatId);

  // 1. Shared location → nearest collection centers (deterministic, no LLM).
  if (msg.location) {
    const centros = await fetchCentros();
    await sendMessage(
      chatId,
      nearestHelpReply(msg.location.latitude, msg.location.longitude, centros),
    );
    return;
  }

  // 2. Shared photo → missing-person search (candidates for human verification).
  if (msg.photo && msg.photo.length > 0) {
    const largest = msg.photo[msg.photo.length - 1];
    const file = await getFileDataUrl(largest.file_id);
    if (!file) {
      await sendMessage(
        chatId,
        "No pude leer la foto. Descríbeme a la persona (nombre, rasgos) y la busco.",
      );
      return;
    }
    const messages: ModelMessage[] = [
      {
        role: "user",
        content: [
          { type: "file", mediaType: file.mediaType, data: file.dataUrl },
          {
            type: "text",
            text:
              (msg.caption?.trim() || "¿Está reportada esta persona?") +
              " Descríbela y búscala en el registro.",
          },
        ],
      },
    ];
    await sendMessage(chatId, (await askAgent(messages).catch(() => "")) || FALLBACK);
    return;
  }

  const text = (msg.text ?? "").trim();
  if (!text) return;

  // 3. Commands.
  if (text.startsWith("/")) {
    const [cmd, ...rest] = text.split(/\s+/);
    const { reply, query } = resolveCommand(cmd, rest.join(" "));
    if (reply) {
      await sendMessage(chatId, reply);
      return;
    }
    if (query) {
      const answer = await askAgent([{ role: "user", content: query }]).catch(
        () => "",
      );
      await sendMessage(chatId, answer || FALLBACK);
      return;
    }
  }

  // 4. Free text → the agent.
  const answer = await askAgent([{ role: "user", content: text }]).catch(() => "");
  await sendMessage(chatId, answer || FALLBACK);
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (
    secret &&
    req.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return new Response("forbidden", { status: 401 });
  }
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return new Response("ok", { status: 200 }); // not configured yet — ack, do nothing
  }

  let update: { message?: TgMessage };
  try {
    update = await req.json();
  } catch {
    return new Response("ok", { status: 200 });
  }

  // Answer, but always ack Telegram with 200 so it doesn't retry on our errors.
  if (update.message?.chat?.id) {
    try {
      await handle(update.message);
    } catch {
      /* swallow — never make Telegram retry */
    }
  }
  return new Response("ok", { status: 200 });
}
