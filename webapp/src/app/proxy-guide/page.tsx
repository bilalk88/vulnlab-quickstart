import type { Metadata } from 'next';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Proxy Setup Guide | VulnLab Dashboard',
  description: 'Step-by-step guide for configuring Burp Suite and OWASP ZAP to intercept traffic from vulnerable lab applications.',
};

const steps = {
  burp: [
    { step: 1, title: 'Install Burp Suite Community or Pro', body: 'Download from https://portswigger.net/burp. Community edition is free and sufficient for all lab exercises.' },
    { step: 2, title: 'Set the proxy listener', body: 'Burp Suite → Proxy tab → Proxy settings → Listeners → ensure 127.0.0.1:8080 is active.' },
    { step: 3, title: 'Configure your browser', body: 'Browser → Settings → Proxy → Manual: HTTP 127.0.0.1:8080. Firefox: use FoxyProxy extension for quick toggle.' },
    { step: 4, title: 'Download & install the CA cert', body: 'Browse to http://burpsuite (while proxy is active) → download cacert.der → Browser Settings → Certificates → Import → pick cacert.der.' },
    { step: 5, title: 'Intercept lab traffic', body: 'Turn intercept ON in Burp Proxy tab, then navigate to any lab (e.g., http://localhost:8080 for DVWA). Requests will appear in Burp.' },
    { step: 6, title: 'Use FoxyProxy for easy toggling', body: 'Install FoxyProxy Standard in Firefox. Add a profile: Proxy type HTTP, host 127.0.0.1, port 8080. Toggle with one click.' },
  ],
  zap: [
    { step: 1, title: 'Install OWASP ZAP', body: 'Download from https://www.zaproxy.org/ or install via apt: sudo apt install zaproxy.' },
    { step: 2, title: 'Start ZAP & set listener port', body: 'ZAP GUI → Tools → Options → Local Proxies → Port: 8085 (to avoid conflict with Burp).' },
    { step: 3, title: 'Configure browser proxy', body: 'Set browser proxy to 127.0.0.1:8085. Same FoxyProxy profile approach works — create a separate ZAP profile.' },
    { step: 4, title: 'Install ZAP CA certificate', body: 'ZAP → Tools → Options → Dynamic SSL Certificates → Generate → Save. Import the saved cert into browser certificate store.' },
    { step: 5, title: 'Use ZAP spider & active scan', body: 'Right-click a URL in ZAP Sites → Spider → then right-click → Active Scan for automated vulnerability detection.' },
  ],
};

function StepList({ items }: { items: typeof steps.burp }) {
  return (
    <ol className="space-y-4">
      {items.map(({ step, title, body }) => (
        <li key={step} className="flex gap-4">
          <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 text-xs font-bold text-emerald-400">
            {step}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

export default function ProxyGuidePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpenIcon className="h-7 w-7 text-emerald-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Proxy Setup Guide</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure Burp Suite or OWASP ZAP to intercept lab traffic
          </p>
        </div>
      </div>

      {/* Quick reference */}
      <div className="rounded-xl border border-gray-800 bg-black/30 p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Port Quick Reference</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {[
            { tool: 'Burp Suite', port: '8080', note: 'default' },
            { tool: 'OWASP ZAP', port: '8085', note: 'recommended' },
            { tool: 'DVWA Lab', port: '8080', note: '⚠ conflict with Burp' },
            { tool: 'WebGoat Lab', port: '8081', note: '' },
          ].map(r => (
            <div key={r.tool} className="rounded-lg bg-gray-900 border border-gray-800 p-3">
              <div className="text-emerald-400">{r.tool}</div>
              <div className="text-white text-base font-bold">:{r.port}</div>
              {r.note && <div className="text-amber-500 text-[10px] mt-1">{r.note}</div>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-amber-400/80">
          ⚠ DVWA runs on port 8080 — same as Burp default. Use port 8090 for Burp when attacking DVWA, or use ZAP on 8085.
        </p>
      </div>

      {/* Browser command */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 space-y-2">
        <h2 className="text-sm font-semibold text-gray-300">Firefox with isolated proxy profile (recommended)</h2>
        <code className="block font-mono text-xs bg-black/40 text-emerald-300 rounded-md px-4 py-3 border border-gray-800">
          firefox --new-instance -P &quot;BurpLab&quot; --no-remote
        </code>
        <p className="text-xs text-gray-500">Creates a separate Firefox profile for lab work — keeps your personal browser traffic out of Burp.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card title="🔴 Burp Suite Setup"><StepList items={steps.burp} /></Card>
        <Card title="🟢 OWASP ZAP Setup"><StepList items={steps.zap} /></Card>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-emerald-800/30 bg-emerald-900/10 p-5 space-y-2">
        <h2 className="text-sm font-semibold text-emerald-400">💡 Pro Tips</h2>
        <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
          <li>Use <span className="font-mono text-xs text-gray-300">Burp Repeater</span> to replay modified requests without re-intercepting.</li>
          <li>In ZAP, use <span className="font-mono text-xs text-gray-300">HUD (Heads Up Display)</span> mode for in-browser security overlays.</li>
          <li>Add <span className="font-mono text-xs text-gray-300">localhost</span> to your no-proxy exceptions when you don&apos;t want to route local traffic.</li>
          <li>Use <span className="font-mono text-xs text-gray-300">Match and Replace</span> in Burp to auto-modify headers on every request.</li>
        </ul>
      </div>
    </div>
  );
}
