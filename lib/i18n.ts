export type Lang = "es" | "en";

const ES = {
  eyebrow: "Ayuda Venezuela",
  hero_h1: "Ayuda de emergencia, en tu Telegram.",
  hero_sub:
    "Pregunta en español y obtén información clara sobre refugios, agua potable, salud y ayuda humanitaria. Al instante.",
  cta_open: "Abrir en Telegram",
  trust: "Gratis · Sin descargar nada · Sin registro",

  ask_title: "¿Qué puedes preguntar?",
  ask_lead: "Escribe como le hablarías a una persona. Por ejemplo:",
  ask_1: "¿Dónde hay un refugio cerca de mí?",
  ask_2: "¿El agua de mi zona es segura para tomar?",
  ask_3: "¿Dónde consigo atención médica?",
  ask_4: "¿Cómo pido o doy ayuda?",

  how_title: "Cómo funciona",
  how_lead: "Tres pasos. Sin complicaciones.",
  how_1_h: "Escribe tu pregunta",
  how_1_p: "En español, como en una conversación normal.",
  how_2_h: "El bot entiende y consulta",
  how_2_p: "Usa los datos de SOS Venezuela 2026 en tiempo real.",
  how_3_h: "Recibes una respuesta clara",
  how_3_p: "Sin tecnicismos, lista para actuar.",

  surf_title: "¿Cómo funciona por dentro?",
  surf_p1:
    "Este bot es un agente de IA construido sobre Gecko: la capa que hace que cualquier API sea usable por agentes, sin escribir código de integración.",
  surf_p2:
    "Gecko lee la API de SOS Venezuela 2026, genera las herramientas correctas y hace la llamada bien a la primera. Lo mismo funciona para cualquier otra API.",
  surf_note:
    "Gecko nunca guarda tus datos ni el contenido de las respuestas — solo aprende a usar la API.",
  surf_cta: "Ver el código (open source)",

  api_title: "La API que alimenta el bot",
  api_lead:
    "Datos abiertos, sin autenticación, CORS abierto. Construidos sobre la plataforma SOS Venezuela 2026.",
  api_reports:
    "Reportes recientes del mapa de peligros: edificios colapsados, refugios, agua, puntos de ayuda.",
  api_persons:
    "Directorio público de personas reportadas como desaparecidas o encontradas. Búsqueda por nombre.",
  api_stats:
    "Cifras agregadas del directorio de personas: desaparecidos, encontrados, menores.",
  api_damage:
    "Últimas validaciones de daño estructural con veredicto comunitario (habitable / inhabitable).",
  api_news: "Feed de noticias de prensa verificadas sobre el terremoto.",
  api_note: "Base URL:",

  byos_badge: "Para desarrolladores",
  byos_title: "Esta es solo la primera fuente",
  byos_p:
    "¿Tienes una API o una fuente de datos humanitarios? La volvemos usable por agentes de IA. Aporta tu fuente y el bot puede responder con ella.",
  byos_path1_title: "Tienes un OpenAPI",
  byos_path1_desc:
    "Si tu fuente tiene un openapi.json, integrarlo es prácticamente un click. Gecko lee el esquema y genera las herramientas sola.",
  byos_path2_title: "No tienes OpenAPI",
  byos_path2_desc:
    "No hay problema. Descríbenos la API o la fuente y la integramos a mano.",
  byos_cta: "Trae tu fuente →",
  byos_contact: "¿Prefieres hablar? Escríbeme en",

  builders:
    "Construido para el hackathon Build4Venezuela 2026 · Código abierto (MIT) · También aportamos mejoras a la API de SOS Venezuela.",
  footer_contact: "Contacto",
  footer_disc:
    "En una emergencia inmediata, contacta siempre a los servicios locales (171).",
  footer_made: "Hecho con ♥ para Venezuela · por Gecko",

  // Nav
  nav_chat: "Chat",
  nav_devs: "Desarrolladores",

  // Chat page
  chat_title: "Pregunta lo que necesites",
  chat_sub:
    "Chat con datos humanitarios reales, en vivo — personas reportadas y centros de acopio.",
  chat_placeholder: "Escribe tu pregunta…",
  chat_send: "Enviar",
  chat_empty: "Escríbeme una pregunta para empezar.",
  chat_hint_1: "¿Está reportada una persona con el nombre María?",
  chat_hint_2: "¿Cuántas personas siguen desaparecidas?",
  chat_hint_3: "¿Dónde hay centros de acopio?",
  chat_disclaimer:
    "Datos comunitarios sin verificar. En una emergencia, llama al 171.",
  chat_error: "No pude responder ahora mismo. Intenta de nuevo en un momento.",

  // Developer hub
  dev_badge: "Para desarrolladores",
  dev_title: "Un solo servidor. Todas las fuentes.",
  dev_p:
    "Centralizamos las APIs humanitarias de Venezuela y las hacemos usables por agentes de IA — sin escribir código de integración. Conéctate a nuestro MCP y tu agente ya sabe llamarlas bien a la primera. Nunca guardamos las respuestas.",
  dev_sources_title: "Fuentes que ya puedes usar",
  dev_src1_name: "ReportaVNZLA",
  dev_src1_desc:
    "~61.000 personas reportadas (desaparecidas / encontradas) y centros de acopio, con coordenadas. Abierta, sin token.",
  dev_src2_name: "SOS Venezuela 2026",
  dev_src2_desc:
    "Reportes del mapa de peligros, cifras, daños estructurales y noticias verificadas. Abierta, sin token.",
  dev_src_more:
    "¿Tienes otra fuente humanitaria? La añadimos: envía su spec y aparece en el servidor para todos.",
  dev_mcp_title: "1 · Conecta nuestro MCP",
  dev_mcp_p:
    "Añádelo a Claude Code o Cursor. Tu agente descubre las herramientas y llama a la API real.",
  dev_install_title: "2 · O corre Gecko tú mismo",
  dev_install_p:
    "Comprende cualquier OpenAPI en herramientas listas para agentes, en local y gratis.",
  dev_cta_repo: "Ver Gecko en GitHub →",
  dev_cta_chat: "Probar el chat",
};

const EN: typeof ES = {
  eyebrow: "Ayuda Venezuela",
  hero_h1: "Emergency help, right in your Telegram.",
  hero_sub:
    "Ask in plain Spanish and get clear answers about shelters, safe water, health and humanitarian aid. Instantly.",
  cta_open: "Open in Telegram",
  trust: "Free · No app to install · No sign-up",

  ask_title: "What can you ask?",
  ask_lead: "Type it like you'd talk to a person. For example:",
  ask_1: "Where is the nearest shelter?",
  ask_2: "Is the water in my area safe to drink?",
  ask_3: "Where can I get medical care?",
  ask_4: "How do I ask for or offer help?",

  how_title: "How it works",
  how_lead: "Three steps. No hassle.",
  how_1_h: "Type your question",
  how_1_p: "In plain Spanish, like a normal conversation.",
  how_2_h: "The bot understands & looks it up",
  how_2_p: "Using SOS Venezuela 2026 data in real time.",
  how_3_h: "You get a clear answer",
  how_3_p: "No jargon, ready to act on.",

  surf_title: "What's under the hood?",
  surf_p1:
    "This bot is an AI agent built on Gecko: the layer that makes any API usable by agents — without writing integration code.",
  surf_p2:
    "Gecko reads the SOS Venezuela 2026 API, generates the right tools, and makes the correct call on the first try. The same works for any other API.",
  surf_note:
    "Gecko never stores your data or the API's responses — it only learns how to call the API.",
  surf_cta: "See the code (open source)",

  api_title: "The API powering the bot",
  api_lead:
    "Open data, no auth required, CORS open. Built on the SOS Venezuela 2026 platform.",
  api_reports:
    "Recent hazard map reports: collapsed buildings, shelters, water points, aid centers.",
  api_persons:
    "Public directory of reported missing or found persons. Search by name.",
  api_stats:
    "Aggregate counts from the persons directory: missing, found, minors.",
  api_damage:
    "Latest structural damage validations with community verdict (habitable / inhabitable).",
  api_news: "Verified press news feed about the earthquake.",
  api_note: "Base URL:",

  byos_badge: "For developers",
  byos_title: "This is just the first source",
  byos_p:
    "Have a humanitarian API or data source? We make it usable by AI agents. Contribute your source and the bot can answer with it.",
  byos_path1_title: "You have an OpenAPI",
  byos_path1_desc:
    "If your source has an openapi.json, integrating it is basically one click. Gecko reads the schema and generates the tools automatically.",
  byos_path2_title: "No OpenAPI",
  byos_path2_desc:
    "No problem. Describe the API or data source and we'll integrate it by hand.",
  byos_cta: "Bring your source →",
  byos_contact: "Prefer to talk? Reach me on",

  builders:
    "Built for the Build4Venezuela 2026 hackathon · Open source (MIT) · We also contributed improvements back to the SOS Venezuela API.",
  footer_contact: "Contact",
  footer_disc: "In an immediate emergency, always contact your local services (171).",
  footer_made: "Made with ♥ for Venezuela · by Gecko",

  // Nav
  nav_chat: "Chat",
  nav_devs: "Developers",

  // Chat page
  chat_title: "Ask what you need",
  chat_sub:
    "Chat with real, live humanitarian data — reported people and collection centers.",
  chat_placeholder: "Type your question…",
  chat_send: "Send",
  chat_empty: "Send me a question to get started.",
  chat_hint_1: "Is there anyone reported with the name María?",
  chat_hint_2: "How many people are still missing?",
  chat_hint_3: "Where are the collection centers?",
  chat_disclaimer:
    "Unverified community data. In an emergency, call 171.",
  chat_error: "I couldn't answer right now. Please try again in a moment.",

  // Developer hub
  dev_badge: "For developers",
  dev_title: "One server. Every source.",
  dev_p:
    "We centralize Venezuela's humanitarian APIs and make them usable by AI agents — with no integration code. Connect to our MCP and your agent already knows how to call them right the first time. We never store the responses.",
  dev_sources_title: "Sources you can use today",
  dev_src1_name: "ReportaVNZLA",
  dev_src1_desc:
    "~61,000 reported people (missing / found) and collection centers, with coordinates. Open, no token.",
  dev_src2_name: "SOS Venezuela 2026",
  dev_src2_desc:
    "Hazard-map reports, aggregate counts, structural damage and verified news. Open, no token.",
  dev_src_more:
    "Have another humanitarian source? We add it: send its spec and it shows up on the server for everyone.",
  dev_mcp_title: "1 · Connect our MCP",
  dev_mcp_p:
    "Add it to Claude Code or Cursor. Your agent discovers the tools and calls the real API.",
  dev_install_title: "2 · Or run Gecko yourself",
  dev_install_p:
    "Comprehend any OpenAPI into agent-ready tools, locally and for free.",
  dev_cta_repo: "See Gecko on GitHub →",
  dev_cta_chat: "Try the chat",
};

export const translations: Record<Lang, typeof ES> = { es: ES, en: EN };
