// Nearest-relief geo helpers — pure, deterministic. The "nearest collection center"
// answer is a Haversine over coordinates, NOT an LLM call: reliable and free. TS port
// of the Python bot's geo.py.

const EARTH_KM = 6371.0088;

export interface Place {
  nombre?: string;
  direccion?: string | null;
  recibe?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlam = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dphi / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dlam / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(a));
}

export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** The nearest `limit` places with usable coordinates, each with a `distanciaKm`. */
export function nearest(
  userLat: number,
  userLng: number,
  places: Place[],
  limit = 3,
): Array<Place & { lat: number; lng: number; distanciaKm: number }> {
  const scored: Array<{ d: number; p: Place & { lat: number; lng: number } }> =
    [];
  for (const p of places) {
    const lat = Number(p.lat);
    const lng = Number(p.lng);
    if (
      p.lat == null ||
      p.lng == null ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    )
      continue;
    scored.push({ d: haversineKm(userLat, userLng, lat, lng), p: { ...p, lat, lng } });
  }
  scored.sort((a, b) => a.d - b.d);
  return scored
    .slice(0, limit)
    .map(({ d, p }) => ({ ...p, distanciaKm: Math.round(d * 10) / 10 }));
}

/** Plain-text Spanish reply for the nearest collection centers (Telegram-safe). */
export function nearestHelpReply(
  userLat: number,
  userLng: number,
  centros: Place[],
  limit = 3,
): string {
  const near = nearest(userLat, userLng, centros, limit);
  if (near.length === 0) {
    return (
      "No encontré centros de acopio con ubicación registrada cerca de ti. " +
      "Puedes ver el mapa completo en https://reportavnzla.com"
    );
  }
  const lines = ["📍 Centros de acopio más cercanos a ti:\n"];
  near.forEach((p, i) => {
    const nombre = (p.nombre || "Centro de acopio").trim();
    lines.push(`${i + 1}. ${nombre} — ${p.distanciaKm} km`);
    const direccion = (p.direccion || "").trim();
    if (direccion) lines.push(`   ${direccion}`);
    const recibe = (p.recibe || "").split("\n")[0].trim();
    if (recibe) lines.push(`   Recibe: ${recibe.slice(0, 70)}`);
    lines.push(`   🗺️ ${mapsLink(p.lat, p.lng)}`);
  });
  lines.push("\nFuente: ReportaVNZLA. Emergencias: 171.");
  return lines.join("\n");
}

/** Live-fetch collection centers (with coordinates) from ReportaVNZLA. Never throws. */
export async function fetchCentros(): Promise<Place[]> {
  try {
    const r = await fetch(
      "https://reportavnzla.com/api/v1/recursos?tipo=centro_acopio&limit=200",
      { headers: { accept: "application/json" } },
    );
    if (!r.ok) return [];
    const body = (await r.json()) as { data?: Place[] };
    return Array.isArray(body.data) ? body.data : [];
  } catch {
    return [];
  }
}
