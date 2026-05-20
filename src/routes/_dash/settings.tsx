import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Key, Server, Mail, Copy, RefreshCw, Check, Plug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_dash/settings")({ component: SettingsPage });

const tabs = [
  { id: "api", label: "API Keys", icon: Key },
  { id: "wazuh", label: "Wazuh Integration", icon: Server },
  { id: "email", label: "Email Notifications", icon: Mail },
];

function SettingsPage() {
  const [tab, setTab] = useState("api");
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Configuration</div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage integrations, credentials, and notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all ${
                  active ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div>
          {tab === "api" && <ApiKeys />}
          {tab === "wazuh" && <WazuhSettings />}
          {tab === "email" && <EmailSettings />}
        </div>
      </div>
    </div>
  );
}

function ApiKeys() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText("sk_live_sn_4xa9P2qK7tLm…");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">API Keys</CardTitle>
        <p className="text-sm text-muted-foreground">Use these keys to authenticate Sentinel SDK and API requests.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Production key</Label>
            <Badge variant="outline" className="border-success/30 text-success bg-success/10">Active</Badge>
          </div>
          <div className="flex gap-2">
            <Input readOnly value="sk_live_sn_4xa9P2qK7tLm•••••••••••••••" className="font-mono text-sm bg-secondary/40" />
            <Button variant="outline" size="icon" onClick={copy}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
          </div>
          <p className="text-xs text-muted-foreground">Last used 4 min ago · Created Mar 12, 2025</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Development key</Label>
            <Badge variant="outline">Sandbox</Badge>
          </div>
          <div className="flex gap-2">
            <Input readOnly value="sk_test_sn_dQp1Wm9xZ•••••••••••••••" className="font-mono text-sm bg-secondary/40" />
            <Button variant="outline" size="icon"><Copy className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </div>

        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Key className="h-4 w-4 mr-1.5" /> Generate new key
        </Button>
      </CardContent>
    </Card>
  );
}

function WazuhSettings() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plug className="h-5 w-5 text-primary" /> Wazuh Integration
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Stream Wazuh agent telemetry into Sentinel AI for correlation.</p>
          </div>
          <Badge variant="outline" className="border-success/30 text-success bg-success/10">
            <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse" /> Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wzhost">Manager host</Label>
            <Input id="wzhost" defaultValue="wazuh.internal.acme.com" className="bg-secondary/40 font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wzport">API port</Label>
            <Input id="wzport" defaultValue="55000" className="bg-secondary/40 font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wzuser">API username</Label>
            <Input id="wzuser" defaultValue="sentinel-svc" className="bg-secondary/40" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wzpw">API password</Label>
            <Input id="wzpw" type="password" defaultValue="••••••••••" className="bg-secondary/40" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="wzidx">Index pattern</Label>
            <Input id="wzidx" defaultValue="wazuh-alerts-4.x-*" className="bg-secondary/40 font-mono text-sm" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Auto-ingest alerts</div>
              <div className="text-xs text-muted-foreground">Pull new Wazuh alerts every 30 seconds</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Enrich with MITRE ATT&CK</div>
              <div className="text-xs text-muted-foreground">Map rules to tactics and techniques automatically</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Test connection</Button>
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmailSettings() {
  const channels = [
    { id: "crit", label: "Critical incidents", desc: "Page on every SEV-1 within 60 seconds", on: true },
    { id: "high", label: "High severity alerts", desc: "Hourly digest grouped by attack type", on: true },
    { id: "daily", label: "Daily SOC summary", desc: "AI-generated brief delivered at 08:00", on: true },
    { id: "weekly", label: "Weekly executive report", desc: "Trend analysis, MTTD/MTTR, posture score", on: false },
    { id: "auto", label: "Automated response actions", desc: "Notify when AI runs containment playbook", on: false },
  ];
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Email Notifications</CardTitle>
        <p className="text-sm text-muted-foreground">Choose which events reach your inbox.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="recip">Recipients</Label>
          <Input id="recip" defaultValue="soc-team@acme.com, on-call@acme.com" className="bg-secondary/40" />
          <p className="text-xs text-muted-foreground">Comma-separated · supports distribution lists</p>
        </div>

        <Separator />

        <div className="space-y-3">
          {channels.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-4 p-3 rounded-md border border-border bg-secondary/30">
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.desc}</div>
              </div>
              <Switch defaultChecked={c.on} />
            </div>
          ))}
        </div>

        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">Save preferences</Button>
      </CardContent>
    </Card>
  );
}
