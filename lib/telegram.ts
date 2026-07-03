// Thin Telegram Bot API helpers for the webhook. Token comes from the env only.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const API = (method: string) => `https://api.telegram.org/bot${TOKEN}/${method}`;

const TELEGRAM_LIMIT = 4096;

/** Split a reply into Telegram-sized chunks, preferring line then word boundaries. */
export function chunk(text: string, limit = TELEGRAM_LIMIT): string[] {
  const t = text.trim();
  if (t.length <= limit) return [t];
  const out: string[] = [];
  let rest = t;
  while (rest.length > limit) {
    const window = rest.slice(0, limit);
    let cut = Math.max(window.lastIndexOf("\n"), window.lastIndexOf(" "));
    if (cut <= 0) cut = limit;
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out.filter(Boolean);
}

export async function sendMessage(chatId: number, text: string): Promise<void> {
  for (const part of chunk(text)) {
    await fetch(API("sendMessage"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: part }),
    }).catch(() => {});
  }
}

export async function sendChatAction(
  chatId: number,
  action = "typing",
): Promise<void> {
  await fetch(API("sendChatAction"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action }),
  }).catch(() => {});
}

/** Download a Telegram file by id, returned as a base64 data URL + media type.
 *  The token-bearing file URL never leaves this function. Returns null on failure. */
export async function getFileDataUrl(
  fileId: string,
): Promise<{ dataUrl: string; mediaType: string } | null> {
  try {
    const meta = await fetch(API("getFile"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ file_id: fileId }),
    }).then((r) => r.json() as Promise<{ ok: boolean; result?: { file_path?: string } }>);
    const path = meta.result?.file_path;
    if (!meta.ok || !path) return null;
    const bin = await fetch(
      `https://api.telegram.org/file/bot${TOKEN}/${path}`,
    );
    if (!bin.ok) return null;
    const mediaType = bin.headers.get("content-type") ?? "image/jpeg";
    const base64 = Buffer.from(await bin.arrayBuffer()).toString("base64");
    return { dataUrl: `data:${mediaType};base64,${base64}`, mediaType };
  } catch {
    return null;
  }
}
