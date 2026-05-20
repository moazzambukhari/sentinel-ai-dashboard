import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Download, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { alerts, severityStyles, statusStyles, type Severity } from "@/lib/soc-data";

export const Route = createFileRoute("/_dash/alerts")({ component: AlertsPage });

function AlertsPage() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<"all" | Severity>("all");

  const filtered = useMemo(
    () =>
      alerts.filter((a) => {
        if (sev !== "all" && a.severity !== sev) return false;
        if (!q) return true;
        const s = q.toLowerCase();
        return (
          a.attackType.toLowerCase().includes(s) ||
          a.sourceIp.includes(s) ||
          a.aiSummary.toLowerCase().includes(s) ||
          a.id.toLowerCase().includes(s)
        );
      }),
    [q, sev]
  );

  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 } as Record<Severity, number>;
    alerts.forEach((a) => (c[a.severity] += 1));
    return c;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Detection</div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} of {alerts.length} alerts · last 48 hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> Export</Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Summarize all
          </Button>
        </div>
      </div>

      {/* Severity tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
          <button
            key={s}
            onClick={() => setSev(sev === s ? "all" : s)}
            className={`text-left rounded-lg border p-4 transition-all hover:-translate-y-0.5 ${
              sev === s ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={severityStyles[s]}>{s}</Badge>
              <span className="text-xs text-muted-foreground">{((counts[s] / alerts.length) * 100).toFixed(0)}%</span>
            </div>
            <div className="text-2xl font-bold mt-2">{counts[s]}</div>
          </button>
        ))}
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search alerts, IPs, attack types…"
                className="pl-9 bg-background/60"
              />
            </div>
            <Select value={sev} onValueChange={(v) => setSev(v as Severity | "all")}>
              <SelectTrigger className="w-[180px] bg-background/60">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40 border-border">
                  <TableHead className="w-[150px]">Timestamp</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Attack Type</TableHead>
                  <TableHead className="min-w-[280px]">AI Summary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id} className="border-border hover:bg-secondary/20">
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {new Date(a.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severityStyles[a.severity]}>{a.severity}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{a.sourceIp}</TableCell>
                    <TableCell className="text-sm font-medium">{a.attackType}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-md">
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{a.aiSummary}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[a.status]}>{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                      No alerts match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
