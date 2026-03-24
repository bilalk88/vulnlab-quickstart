import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Tools Reference | VulnLab Dashboard',
  description: 'Quick reference for Go-based recon tools, Python security tools, and wordlists installed by the lab setup script.',
};

const GO_TOOLS = [
  { name: 'subfinder',    desc: 'Passive subdomain discovery',                 url: 'https://github.com/projectdiscovery/subfinder'  },
  { name: 'httpx',        desc: 'HTTP probe & technology detection',           url: 'https://github.com/projectdiscovery/httpx'      },
  { name: 'nuclei',       desc: 'Template-based vulnerability scanner',        url: 'https://github.com/projectdiscovery/nuclei'     },
  { name: 'katana',       desc: 'Fast crawling and spidering framework',       url: 'https://github.com/projectdiscovery/katana'     },
  { name: 'waybackurls',  desc: 'Fetch URLs from Wayback Machine',             url: 'https://github.com/tomnomnom/waybackurls'       },
  { name: 'gf',           desc: 'Pattern matching with Grep Friendly wrapper', url: 'https://github.com/tomnomnom/gf'                },
  { name: 'gau',          desc: 'Fetch URLs from VirusTotal + Wayback + OTX', url: 'https://github.com/lc/gau'                      },
  { name: 'ffuf',         desc: 'Fast web fuzzer',                             url: 'https://github.com/ffuf/ffuf'                   },
  { name: 'gobuster',     desc: 'Directory, DNS & vHost bruteforcing',         url: 'https://github.com/OJ/gobuster'                 },
  { name: 'hakrawler',    desc: 'Simple, fast web crawler for recon',          url: 'https://github.com/hakluke/hakrawler'           },
];

const PY_TOOLS = [
  { name: 'arjun',          desc: 'HTTP parameter discovery' },
  { name: 'uro',            desc: 'De-duplicate URL lists' },
  { name: 'sqlmap',         desc: 'Automatic SQL injection & takeover tool' },
  { name: 'pycurl',         desc: 'Python bindings for cURL' },
  { name: 'requests',       desc: 'HTTP library for humans' },
  { name: 'beautifulsoup4', desc: 'HTML/XML parsing' },
  { name: 'pyjwt',          desc: 'JWT encode/decode library' },
];

const SYS_TOOLS = [
  { name: 'nmap',      desc: 'Network port scanner' },
  { name: 'masscan',   desc: 'High-speed port scanner' },
  { name: 'hydra',     desc: 'Network login brute-forcer' },
  { name: 'john',      desc: 'Password cracker (John the Ripper)' },
  { name: 'hashcat',   desc: 'GPU-accelerated password recovery' },
  { name: 'nikto',     desc: 'Web server scanner' },
  { name: 'wpscan',    desc: 'WordPress vulnerability scanner' },
  { name: 'dirsearch', desc: 'Web path scanner' },
];

function ToolTable({ tools }: { tools: { name: string; desc: string; url?: string }[] }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border-dim)', background: 'var(--bg-card)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b" style={{ borderColor: 'var(--border-dim)', background: 'rgba(255,255,255,0.02)' }}>
            <th className="px-5 py-3 font-mono text-[10px] tracking-widest text-[#7b8db0] w-48 font-semibold">BINARY / TOOL</th>
            <th className="px-5 py-3 font-mono text-[10px] tracking-widest text-[#7b8db0] font-semibold">CAPABILITY</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border-dim)' }}>
          {tools.map(t => (
            <tr key={t.name} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3">
                {t.url ? (
                  <a href={t.url} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[#00e5ff] hover:text-white transition-colors flex items-center gap-2">
                    {t.name} <span className="opacity-50 text-[10px]">↗</span>
                  </a>
                ) : (
                  <span className="font-mono text-[#00e5ff]">{t.name}</span>
                )}
              </td>
              <td className="px-5 py-3 text-[#7b8db0] text-xs">
                {t.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b pb-6" style={{ borderColor: 'var(--border-dim)' }}>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="text-[#00e5ff]">/</span> TOOL_INVENTORY
        </h1>
        <p className="text-sm font-mono mt-2" style={{ color: 'var(--text-secondary)' }}>
          Installed packages and payloads from `pentest-lab-setup.sh`
        </p>
      </div>

      {/* Quick commands box */}
      <div className="rounded-xl border p-5 space-y-4 relative overflow-hidden" 
        style={{ borderColor: 'var(--border-dim)', background: 'var(--bg-card)' }}>
        
        {/* Accent top edge */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50" />
        
        <h2 className="text-xs font-mono font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>COMMON EXECUTION SNIPPETS</h2>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: 'WAIT FOR REVERSE SHELL', cmd: 'nc -lvnp 4444' },
            { label: 'SPAWN HTTP FILE SERVER', cmd: 'python3 -m http.server 8888' },
            { label: 'LAB DOCKER STATUS',      cmd: 'cd ~/pentest-lab && docker compose ps' },
            { label: 'UPDATE TEMPLATES',       cmd: 'nuclei -update-templates' },
            { label: 'FUZZ DIRECTORIES',       cmd: 'ffuf -w wordlists/common.txt -u http://TARGET/FUZZ' },
          ].map(({ label, cmd }) => (
            <div key={cmd} className="flex flex-col sm:flex-row sm:items-center p-2 rounded bg-black/40 border border-[#1a2340]">
              <span className="text-[10px] font-mono tracking-widest w-48 shrink-0 mb-1 sm:mb-0" style={{ color: '#7b8db0' }}>
                {label}
              </span>
              <code className="font-mono text-[11px] px-3 py-1 bg-black rounded border border-[#1a2340] text-[#00ff88] flex-1 overflow-x-auto">
                $ {cmd}
              </code>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-2">
          <span className="text-[#00ff88]">■</span> GO_LANG RECON MODULES
        </h2>
        <ToolTable tools={GO_TOOLS} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-2">
          <span className="text-[#ffcc00]">■</span> PYTHON_3 EXPLOIT MODULES
        </h2>
        <ToolTable tools={PY_TOOLS} />
      </section>

      <section className="space-y-4 mb-20">
        <h2 className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-2">
          <span className="text-[#ff4566]">■</span> SYSTEM / APT BINARIES
        </h2>
        <ToolTable tools={SYS_TOOLS} />
      </section>
    </div>
  );
}
