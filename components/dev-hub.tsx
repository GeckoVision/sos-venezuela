import Link from "next/link";

interface DevHubProps {
  t: Record<string, string>;
}

function Code({ children }: { children: string }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-navy-deep text-subtle text-[13px] leading-relaxed p-4 font-mono">
      <pre className="whitespace-pre">{children}</pre>
    </div>
  );
}

export default function DevHub({ t }: DevHubProps) {
  return (
    <section id="developers" className="bg-navy text-white py-16 md:py-20">
      <div className="mx-auto max-w-[920px] px-5">
        <span className="inline-block text-[13px] font-bold tracking-[1.5px] uppercase text-yellow bg-yellow/12 px-3 py-1.5 rounded-full mb-4">
          {t.dev_badge}
        </span>
        <h2 className="text-[clamp(24px,4vw,34px)] font-extrabold tracking-tight mb-3 text-balance">
          {t.dev_title}
        </h2>
        <p className="text-subtle max-w-[640px] leading-relaxed text-pretty mb-10">
          {t.dev_p}
        </p>

        {/* Sources */}
        <h3 className="text-[15px] font-bold uppercase tracking-wide text-subtle mb-3">
          {t.dev_sources_title}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            { n: t.dev_src1_name, d: t.dev_src1_desc, u: "https://reportavnzla.com" },
            { n: t.dev_src2_name, d: t.dev_src2_desc, u: "https://sosvenezuela2026.com" },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="font-bold text-white mb-1">{s.n}</div>
              <p className="text-[14px] text-subtle leading-relaxed">{s.d}</p>
              <a
                href={s.u}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-[13px] font-semibold text-tg hover:underline break-all"
              >
                {s.u.replace("https://", "")} ↗
              </a>
            </div>
          ))}
        </div>
        <p className="text-[14px] text-subtle mb-12">{t.dev_src_more}</p>

        {/* Two paths */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Path 1 — connect the hosted MCP */}
          <div>
            <h3 className="text-[17px] font-bold mb-1">{t.dev_mcp_title}</h3>
            <p className="text-[14px] text-subtle leading-relaxed mb-3">
              {t.dev_mcp_p}
            </p>
            <Code>{`# Claude Code — add the hosted MCP (no install)
claude mcp add --transport http \\
  reportavnzla \\
  https://mcp.geckovision.tech/reportavnzla/mcp

# Discover the surface (for humans + agents):
#   /reportavnzla/llms.txt
#   /reportavnzla/gecko.json`}</Code>
          </div>

          {/* Path 2 — run Gecko yourself */}
          <div>
            <h3 className="text-[17px] font-bold mb-1">{t.dev_install_title}</h3>
            <p className="text-[14px] text-subtle leading-relaxed mb-3">
              {t.dev_install_p}
            </p>
            <Code>{`pip install gecko-surf

# Comprehend any OpenAPI into first-call-correct tools:
python -c "
from gecko import AgentApiClient, public_session
c = AgentApiClient('openapi.json', session=public_session())
print(c.search('find donation centers')[0]['name'])
"`}</Code>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://github.com/GeckoVision/gecko-surf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-full text-[15px] text-navy bg-white transition-transform hover:-translate-y-px"
          >
            {t.dev_cta_repo}
          </a>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 font-bold px-5 py-2.5 rounded-full text-[15px] text-white border border-white/22 bg-white/8 transition-transform hover:-translate-y-px"
          >
            {t.dev_cta_chat}
          </Link>
        </div>
      </div>
    </section>
  );
}
