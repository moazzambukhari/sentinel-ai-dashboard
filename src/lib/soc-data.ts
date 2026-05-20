export type Severity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "open" | "investigating" | "resolved";

export interface Alert {
  id: string;
  timestamp: string;
  severity: Severity;
  sourceIp: string;
  attackType: string;
  aiSummary: string;
  status: AlertStatus;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: "active" | "contained" | "resolved";
  assignee: string | null;
  createdAt: string;
  aiExplanation: string;
  remediation: string[];
  timeline: { time: string; event: string; actor: string }[];
}

const attackTypes = [
  "Brute Force SSH", "SQL Injection", "Phishing Payload", "DDoS Flood",
  "Privilege Escalation", "Malware C2 Beacon", "Credential Stuffing",
  "Data Exfiltration", "Lateral Movement", "Ransomware Activity",
];

const ips = ["185.220.101.42", "194.165.16.78", "45.155.205.233", "103.149.162.10",
  "162.247.74.27", "23.129.64.144", "91.219.236.222", "5.255.99.205"];

const severities: Severity[] = ["critical", "high", "medium", "low"];
const statuses: AlertStatus[] = ["open", "investigating", "resolved"];

function seed(i: number) { return Math.abs(Math.sin(i * 9301 + 49297) * 233280) % 1; }

export const alerts: Alert[] = Array.from({ length: 32 }, (_, i) => {
  const sev = severities[Math.floor(seed(i) * 4)];
  const at = attackTypes[Math.floor(seed(i + 1) * attackTypes.length)];
  const ip = ips[Math.floor(seed(i + 2) * ips.length)];
  const st = statuses[Math.floor(seed(i + 3) * statuses.length)];
  const minutesAgo = Math.floor(seed(i + 4) * 60 * 48);
  const d = new Date(Date.now() - minutesAgo * 60_000);
  return {
    id: `ALT-${(10234 + i).toString()}`,
    timestamp: d.toISOString(),
    severity: sev,
    sourceIp: ip,
    attackType: at,
    aiSummary: `Detected ${at.toLowerCase()} pattern from ${ip}. Correlation score ${(seed(i + 5) * 100).toFixed(1)}%. ${
      sev === "critical" ? "Immediate containment advised." : "Monitoring active."
    }`,
    status: st,
  };
});

export const incidents: Incident[] = [
  {
    id: "INC-2041",
    title: "Suspected Ransomware Staging on FIN-DB-02",
    severity: "critical",
    status: "active",
    assignee: null,
    createdAt: new Date(Date.now() - 42 * 60_000).toISOString(),
    aiExplanation:
      "An endpoint in the finance segment exhibited rapid file enumeration followed by encryption-like entropy increase across 1,284 documents. The behavior matches the LockBit 3.0 TTP cluster (T1486, T1490). Lateral SMB scans originating from the same host suggest staging for broader deployment.",
    remediation: [
      "Isolate FIN-DB-02 from the network via EDR containment",
      "Revoke active Kerberos tickets for service account svc_fin_backup",
      "Restore affected shares from the 02:00 UTC snapshot",
      "Block outbound traffic to 185.220.101.42 at the perimeter firewall",
    ],
    timeline: [
      { time: "12 min ago", event: "AI correlation flagged encryption pattern", actor: "Sentinel AI" },
      { time: "9 min ago", event: "EDR auto-quarantined sample lsass_dump.exe", actor: "CrowdStrike" },
      { time: "4 min ago", event: "Lateral SMB scan to 12 hosts detected", actor: "Wazuh" },
      { time: "1 min ago", event: "Incident escalated to SEV-1", actor: "Sentinel AI" },
    ],
  },
  {
    id: "INC-2039",
    title: "Credential Stuffing Wave Against SSO Portal",
    severity: "high",
    status: "contained",
    assignee: "M. Alvarez",
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    aiExplanation:
      "47,210 authentication attempts across 2,103 distinct accounts in 18 minutes from a residential proxy pool. 14 accounts compromised; MFA blocked downstream access.",
    remediation: [
      "Force password reset on 14 confirmed compromised accounts",
      "Enable adaptive rate limiting on /auth/v2/login",
      "Push IoC list to WAF block group CS-2024-Q4",
    ],
    timeline: [
      { time: "3h ago", event: "Auth anomaly threshold breached", actor: "Sentinel AI" },
      { time: "2h 50m ago", event: "WAF rule deployed, 92% traffic blocked", actor: "Cloudflare" },
      { time: "2h 10m ago", event: "Incident assigned to M. Alvarez", actor: "SOC L2" },
    ],
  },
  {
    id: "INC-2036",
    title: "Suspicious PowerShell Execution on HR-WS-118",
    severity: "medium",
    status: "resolved",
    assignee: "K. Tanaka",
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    aiExplanation:
      "Encoded PowerShell command attempted to download a payload from a newly registered domain. EDR blocked execution; user confirmed clicking a phishing link.",
    remediation: ["Reimage HR-WS-118", "Enroll user in phishing training", "Add domain to DNS sinkhole"],
    timeline: [
      { time: "1d ago", event: "Encoded PS command flagged", actor: "Wazuh" },
      { time: "23h ago", event: "Payload download blocked", actor: "EDR" },
      { time: "20h ago", event: "Incident resolved", actor: "K. Tanaka" },
    ],
  },
];

export const threatTrend = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(Date.now() - (13 - i) * 86400_000);
  return {
    day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    critical: Math.round(4 + seed(i) * 18),
    high: Math.round(12 + seed(i + 100) * 28),
    medium: Math.round(30 + seed(i + 200) * 40),
  };
});

export const attackMix = [
  { name: "Brute Force", value: 142 },
  { name: "Phishing", value: 98 },
  { name: "Malware", value: 76 },
  { name: "Recon", value: 54 },
  { name: "DDoS", value: 31 },
];

export const severityStyles: Record<Severity, string> = {
  critical: "bg-critical/15 text-critical border-critical/30",
  high: "bg-warning/15 text-warning border-warning/30",
  medium: "bg-info/15 text-info border-info/30",
  low: "bg-muted text-muted-foreground border-border",
};

export const statusStyles: Record<AlertStatus, string> = {
  open: "bg-critical/15 text-critical border-critical/30",
  investigating: "bg-warning/15 text-warning border-warning/30",
  resolved: "bg-success/15 text-success border-success/30",
};
