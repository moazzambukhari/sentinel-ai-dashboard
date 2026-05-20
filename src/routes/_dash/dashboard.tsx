import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldAlert, AlertTriangle, Server, Sparkles, ArrowUpRight, ArrowDownRight,
  Activity, Eye, Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import { alerts, threatTrend, attackMix, incidents, severityStyles, statusStyles } from "@/lib/soc-data";

export const Route = createFileRoute("/_dash/dashboard")({ component: Dashboard });

const stats = [
  { label: "Total Alerts (24h)", value: "1,284", delta: "+12.4%", trend: "up", icon: Eye, accent: "text-info", bg: "bg-info/10" },
  { label: "Critical Threats", value: "7", delta: "+2", trend: "up", icon: AlertTriangle, accent: "text-critical", bg: "bg-critical/10" },
  { label: "Active Endpoints", value: "1,284", delta: "-3", trend: "down", icon: Server, accent: "text-success", bg: "bg-success/10" },
  { label: "Mean Time to Detect", value: "2m 18s", delta: "-31%", trend: "down", icon: Clock, accent: "text-primary", bg: "bg-primary/10" },
];

function Dashboard() {
  const recentAlerts = alerts.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Operations Overview</div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Security Posture</h1>
          <p className="text-sm text-muted-foreground mt-1">Last 24 hours · auto-refresh 30s</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export report</Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Ask AI
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const TrendIcon = s.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={s.label} className="border-border bg-card hover:shadow-card transition-all hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`h-10 w-10 rounded-lg ${s.bg} grid place-items-center`}>
                    <Icon className={`h-5 w-5 ${s.accent}`} />
                  </div>
                  <Badge variant="outline" className={`gap-1 ${s.trend === "up" ? "text-warning border-warning/30" : "text-success border-success/30"}`}>
                    <TrendIcon className="h-3 w-3" /> {s.delta}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI summary */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardContent className="p-5 flex flex-col lg:flex-row gap-5">
          <div className="flex items-center gap-3 lg:flex-col lg:items-start">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center glow shrink-0">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-primary">AI Threat Summary</div>
              <div className="text-[10px] text-muted-foreground">Generated 1 min ago</div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm leading-relaxed text-foreground/90">
              Threat activity is <span className="text-warning font-medium">elevated</span> in the last 24h, driven by a coordinated
              credential-stuffing campaign against your SSO portal (47k attempts, 14 confirmed compromises) and an isolated
              ransomware staging event on <span className="font-mono text-primary">FIN-DB-02</span>. Lateral movement was
              blocked by EDR. Recommend prioritizing <span className="text-critical font-medium">INC-2041</span> and reviewing
              MFA enrollment for finance accounts.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="border-critical/30 text-critical bg-critical/10">1 SEV-1</Badge>
              <Badge variant="outline" className="border-warning/30 text-warning bg-warning/10">3 SEV-2</Badge>
              <Badge variant="outline" className="border-info/30 text-info bg-info/10">12 SEV-3</Badge>
              <Badge variant="outline" className="border-border">Confidence 94%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Threat Trends</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Alerts by severity · last 14 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-critical" /> Critical</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> High</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-info" /> Medium</span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={threatTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gCrit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.78 0.17 70)" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="oklch(0.78 0.17 70)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gMed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.15 230)" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="oklch(0.72 0.15 230)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.03 255 / 60%)" vertical={false} />
                  <XAxis dataKey="day" stroke="oklch(0.68 0.02 245)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.68 0.02 245)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.20 0.025 252)", border: "1px solid oklch(0.28 0.03 255)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="medium" stroke="oklch(0.72 0.15 230)" fill="url(#gMed)" strokeWidth={2} />
                  <Area type="monotone" dataKey="high" stroke="oklch(0.78 0.17 70)" fill="url(#gHigh)" strokeWidth={2} />
                  <Area type="monotone" dataKey="critical" stroke="oklch(0.65 0.24 25)" fill="url(#gCrit)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Attack Mix</CardTitle>
            <p className="text-xs text-muted-foreground">Top vectors · 7 days</p>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackMix} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="oklch(0.28 0.03 255 / 50%)" />
                  <XAxis type="number" stroke="oklch(0.68 0.02 245)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="oklch(0.68 0.02 245)" fontSize={11} tickLine={false} axisLine={false} width={75} />
                  <Tooltip contentStyle={{ background: "oklch(0.20 0.025 252)", border: "1px solid oklch(0.28 0.03 255)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill="oklch(0.78 0.17 195)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">Recent Security Incidents</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Top open cases</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">View all →</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-all hover:-translate-y-0.5">
                <div className={`mt-1 h-2 w-2 rounded-full ${inc.severity === "critical" ? "bg-critical animate-pulse-ring" : inc.severity === "high" ? "bg-warning" : "bg-info"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                    <Badge variant="outline" className={severityStyles[inc.severity]}>{inc.severity}</Badge>
                    <Badge variant="outline" className="text-[10px]">{inc.status}</Badge>
                  </div>
                  <div className="text-sm font-medium mt-1 truncate">{inc.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Assigned to {inc.assignee ?? <span className="text-warning">Unassigned</span>} · {new Date(inc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Live Alert Feed</CardTitle>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Streaming
            </span>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[420px] overflow-y-auto">
            {recentAlerts.map((a) => (
              <div key={a.id} className="animate-in-up flex items-center gap-3 p-2.5 rounded-md border border-border bg-secondary/20">
                <ShieldAlert className={`h-4 w-4 shrink-0 ${a.severity === "critical" ? "text-critical" : a.severity === "high" ? "text-warning" : "text-info"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{a.attackType}</div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">{a.sourceIp} · {a.id}</div>
                </div>
                <Badge variant="outline" className={`${severityStyles[a.severity]} text-[10px]`}>{a.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
