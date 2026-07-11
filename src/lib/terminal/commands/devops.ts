import { CommandDefinition } from "../registry";
import { dnsLookupFn, pingFn, httpHeadersFn, sslInfoFn, portScanFn, whoisFn, robotsFn, ipLookupFn, sitemapFn, securityHeadersFn, cmsDetectionFn } from "@/actions/devops";

export const devopsCommands: CommandDefinition[] = [
  {
    name: "dns",
    description: "Perform a DNS lookup",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: dns <domain>";
      const target = ctx.args[0];
      const res = await dnsLookupFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      return JSON.stringify(res.records, null, 2);
    }
  },
  {
    name: "ping",
    description: "Ping a host (HTTP simulated latency)",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: ping <domain or IP>";
      const target = ctx.args[0];
      const res = await pingFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      return res.result;
    }
  },
  {
    name: "headers",
    description: "Fetch HTTP headers",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: headers <domain>";
      const target = ctx.args[0];
      const res = await httpHeadersFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      let out = `HTTP Status: ${res.status}\n`;
      for (const [k, v] of Object.entries(res.headers || {})) {
        out += `${k}: ${v}\n`;
      }
      return out;
    }
  },
  {
    name: "ssl",
    description: "Fetch SSL certificate info",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: ssl <domain>";
      const target = ctx.args[0];
      const res = await sslInfoFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      const c = res.cert;
      return `Subject: ${c.subject?.CN || JSON.stringify(c.subject)}
Issuer: ${c.issuer?.O || JSON.stringify(c.issuer)}
Valid From: ${c.valid_from}
Valid To: ${c.valid_to}
Days Remaining: \x1b[1;32m${c.daysRemaining}\x1b[0m
Protocol: ${c.protocol}
Cipher: ${c.cipher}`;
    }
  },
  {
    name: "ports",
    description: "Scan common ports",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: ports <domain or IP>";
      const target = ctx.args[0];
      return `Scanning common ports on ${target}...\nThis may take a moment.\n` + 
             await portScanFn({ data: target }).then((res: any) => {
               if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
               return res.results.map((r: any) => `Port ${r.port.toString().padEnd(5)} : ${r.status === 'open' ? '\x1b[1;32mOPEN\x1b[0m' : '\x1b[1;31mCLOSED\x1b[0m'}`).join("\n");
             });
    }
  },
  {
    name: "whois",
    description: "WHOIS lookup (via IANA)",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: whois <domain>";
      const target = ctx.args[0];
      const res = await whoisFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      return res.data;
    }
  },
  {
    name: "robots",
    description: "Fetch robots.txt",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: robots <domain>";
      const target = ctx.args[0];
      const res = await robotsFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      return res.text;
    }
  },
  {
    name: "ip",
    description: "IP Geolocation lookup",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: ip <domain or IP>";
      const target = ctx.args[0];
      const res = await ipLookupFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      const i = res.info;
      if (i.status === "fail") return `\x1b[1;31mError:\x1b[0m ${i.message}`;
      return `IP: ${i.query}
Country: ${i.country}
City: ${i.city}
ISP: ${i.isp}
Org: ${i.org}
AS: ${i.as}`;
    }
  },
  {
    name: "sitemap",
    description: "Fetch sitemap.xml",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: sitemap <domain>";
      const target = ctx.args[0];
      const res = await sitemapFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      return `Found ${res.count} URLs in sitemap.\n\n${res.text}`;
    }
  },
  {
    name: "security",
    description: "Check security headers",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: security <domain>";
      const target = ctx.args[0];
      const res = await securityHeadersFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      let out = `Security Score: \x1b[1;32m${res.score}%\x1b[0m\n\n`;
      for (const [k, v] of Object.entries(res.headers || {})) {
        out += `${k}: ${v === 'Missing' ? '\x1b[1;31mMissing\x1b[0m' : '\x1b[1;32m' + v + '\x1b[0m'}\n`;
      }
      return out;
    }
  },
  {
    name: "cms",
    description: "Detect CMS",
    execute: async (ctx) => {
      if (ctx.args.length === 0) return "Usage: cms <domain>";
      const target = ctx.args[0];
      const res = await cmsDetectionFn({ data: target }) as any;
      if (!res.success) return `\x1b[1;31mError:\x1b[0m ${res.error}`;
      return `Detected Technologies:\n${res.detected?.map((d:string) => `  - \x1b[1;34m${d}\x1b[0m`).join('\n')}`;
    }
  }
];
