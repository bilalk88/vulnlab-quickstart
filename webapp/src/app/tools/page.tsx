import type { Metadata } from 'next';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

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
    <div className="overflow-hidden rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="px-4 py-3 font-semibold text-gray-400 w-40">Tool</th>
            <th className="px-4 py-3 font-semibold text-gray-400">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {tools.map(t => (
            <tr key={t.name} className="hover:bg-gray-900/40 transition">
              <td className="px-4 py-3">
                {t.url ? (
                  <a href={t.url} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-emerald-400 hover:text-emerald-300 transition">
                    {t.name}
                  </a>
                ) : (
                  <span className="font-mono text-emerald-400">{t.name}</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-400">{t.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function ToolsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <WrenchScrewdriverIcon className="h-7 w-7 text-emerald-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Security Tools Reference</h1>
          <p className="text-sm text-gray-500 mt-0.5">All tools installed by <code className="font-mono text-emerald-500">pentest-lab-setup.sh</code></p>
        </div>
      </div>

      {/* Quick commands */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-300">Quick Commands</h2>
        {[
          { label: 'Reverse shell listener',     cmd: 'nc -lvnp 4444' },
          { label: 'Quick Python file server',   cmd: 'python3 -m http.server 8888' },
          { label: 'Check lab containers',       cmd: 'cd ~/pentest-lab && docker compose ps' },
          { label: 'Update Nuclei templates',    cmd: 'nuclei -update-templates' },
          { label: 'Subfinder example',          cmd: 'subfinder -d target.com -silent' },
          { label: 'Nuclei scan',                cmd: 'nuclei -u http://localhost:8080 -severity medium,high,critical' },
          { label: 'ffuf directory brute',       cmd: 'ffuf -w wordlists/common.txt -u http://localhost:8080/FUZZ' },
        ].map(({ label, cmd }) => (
          <div key={cmd} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs text-gray-500 w-48 shrink-0">{label}</span>
            <code className="font-mono text-xs bg-black/40 text-emerald-300 rounded-md px-3 py-1.5 border border-gray-800 flex-1">
              {cmd}
            </code>
          </div>
        ))}
      </div>

      <Section title="🐹 Go-based Recon Tools"><ToolTable tools={GO_TOOLS} /></Section>
      <Section title="🐍 Python Tools"><ToolTable tools={PY_TOOLS} /></Section>
      <Section title="🔧 System / APT Tools"><ToolTable tools={SYS_TOOLS} /></Section>
    </div>
  );
}
