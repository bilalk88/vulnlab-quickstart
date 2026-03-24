import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proxy Setup Guide | VulnLab Dashboard',
  description: 'Step-by-step guide for configuring Burp Suite and OWASP ZAP to intercept traffic from vulnerable lab applications.',
};

const steps = {
  burp: [
    { step: '01', title: 'INSTALL BURP SUITE',      body: 'Download Community Edition from portswigger.net/burp. Free tier is identical for web lab proxies.' },
    { step: '02', title: 'CONFIGURE LISTENER',      body: 'Proxy tab → Proxy settings → Listeners → ensure 127.0.0.1:8080 is bound.' },
    { step: '03', title: 'ROUTE BROWSER TRAFFIC',   body: 'Set browser manual proxy to HTTP 127.0.0.1:8080. Extension FoxyProxy recommended.' },
    { step: '04', title: 'IMPORT CA CERTIFICATE',   body: 'With proxy on, browse to http://burpsuite → download cacert.der → import into browser trusted root CAs.' },
    { step: '05', title: 'CAPTURING REQUESTS',      body: 'Enable "Intercept is on" in Proxy tab. Navigate to DVWA or WebGoat. Traffic will halt and appear in Burp.' },
  ],
  zap: [
    { step: '01', title: 'INSTALL OWASP ZAP',       body: 'Download from zaproxy.org or install via system apt: `sudo apt install zaproxy`' },
    { step: '02', title: 'BIND LISTENER PORT',      body: 'Tools → Options → Local Proxies → Set to Port 8085 (avoids 8080 conflict with apps & Burp).' },
    { step: '03', title: 'ROUTE BROWSER TRAFFIC',   body: 'Set browser manual proxy to HTTP 127.0.0.1:8085. Use a dedicated FoxyProxy profile.' },
    { step: '04', title: 'IMPORT CA CERTIFICATE',   body: 'Tools → Options → Dynamic SSL Certs → Generate → Save. Import into browser.' },
    { step: '05', title: 'INITIALIZE SCAN',         body: 'HUD is active by default. Right-click target in Sites tree → Attack → Active Scan.' },
  ],
};

function StepList({ items, color }: { items: typeof steps.burp, color: string }) {
  return (
    <div className="space-y-[1px] bg-[#1a2340] rounded-xl overflow-hidden border border-[#1a2340]">
      {items.map(({ step, title, body }, idx) => (
        <div key={step} className="flex gap-4 p-5" style={{ background: 'var(--bg-card)' }}>
          <div className="font-mono text-sm mt-0.5" style={{ color }}>
            {step}.
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white mb-1.5">{title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProxyGuidePage() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b pb-6" style={{ borderColor: 'var(--border-dim)' }}>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="text-[#ff4566]">/</span> PROXY_ROUTING
        </h1>
        <p className="text-sm font-mono mt-2" style={{ color: 'var(--text-secondary)' }}>
          HTTP/S interception configuration for external analysis tools.
        </p>
      </div>

      {/* Port Conflicts Box */}
      <div className="rounded-xl border p-5 relative overflow-hidden bg-red-950/20 border-red-900/40">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        <h2 className="text-xs font-mono font-bold tracking-widest text-[#ff6b7a] mb-4">PORT COLLISION MATRIX</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {[
            { tool: 'BURP SUITE', port: '8080', stat: 'DEFAULT' },
            { tool: 'OWASP ZAP',  port: '8085', stat: 'MANUAL CFG' },
            { tool: 'DVWA LAB',   port: '8080', stat: 'CONFLICT!' },
            { tool: 'WEBGOAT',    port: '8081', stat: 'CLEAR' },
          ].map(r => (
            <div key={r.tool} className="rounded border bg-black/40 p-3" style={{ borderColor: r.stat === 'CONFLICT!' ? '#ff4566' : '#1a2340' }}>
              <div style={{ color: 'var(--text-muted)' }} className="text-[10px] tracking-wider mb-1">{r.tool}</div>
              <div className="text-sm font-bold text-white mb-2">:{r.port}</div>
              <div className="text-[9px]" style={{ color: r.stat === 'CONFLICT!' ? '#ff6b7a' : '#00ff88' }}>[{r.stat}]</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] font-mono text-[#ffc66d] border-l-2 border-[#ffc66d] pl-3 py-0.5">
          WARNING: DVWA binds to :8080. If Burp is on 8080, Docker will fail to start DVWA. Move Burp listener to 8090.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-2 mb-4">
            <span className="text-[#ff7b00]">■</span> PORT_SWIGGER.BURP
          </h2>
          <StepList items={steps.burp} color="#ff7b00" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-2 mb-4">
            <span className="text-[#00e5ff]">■</span> OWASP.ZAP
          </h2>
          <StepList items={steps.zap} color="#00e5ff" />
        </div>
      </div>

      {/* Firefox snippet */}
      <div className="rounded-xl border p-5 flex flex-col sm:flex-row items-center gap-5" 
        style={{ borderColor: 'var(--border-dim)', background: 'var(--bg-card)' }}>
        <div className="flex-1 space-y-2">
          <h3 className="text-xs font-mono font-bold text-white tracking-widest">ISOLATED BROWSER PROFILE</h3>
          <p className="text-[11px] text-[#7b8db0]">
            Use this command to launch Firefox in an isolated profile, keeping lab proxy traffic separate from your daily browsing.
          </p>
        </div>
        <code className="font-mono text-[11px] bg-black text-[#00ff88] rounded p-3 border border-[#1a2340] w-full sm:w-auto overflow-x-auto shrink-0">
          firefox --new-instance -P "BurpLab" --no-remote
        </code>
      </div>
    </div>
  );
}
