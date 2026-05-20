import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, UserPlus, ShieldCheck, Clock, ListChecks, Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { incidents, severityStyles } from "@/lib/soc-data";

export const Route = createFileRoute("/_dash/incidents")({ component: IncidentsPage });

function IncidentsPage() {
  const [activeId, setActiveId] = useState(incidents[0].id);
  const active = incidents.find((i) => i.id === activeId)!;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Response</div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Incidents</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-correlated cases requiring analyst review</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List */}
        <div className="space-y-3">
          {incidents.map((inc) => {
            const isActive = inc.id === activeId;
            return (
              <button
                key={inc.id}
                onClick={() => setActiveId(inc.id)}
                className={`w-full text-left rounded-lg border p-4 transition-all hover:-translate-y-0.5 ${
                  isActive ? "border-primary bg-primary/5 shadow-card" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Siren className={`h-4 w-4 ${inc.severity === "critical" ? "text-critical" : inc.severity === "high" ? "text-warning" : "text-info"}`} />
                  <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                  <Badge variant="outline" className={severityStyles[inc.severity]}>{inc.severity}</Badge>
                </div>
                <div className="text-sm font-medium mt-2">{inc.title}</div>
                <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                  <span>{inc.status}</span>
                  <span>·</span>
                  <span>{inc.assignee ?? "Unassigned"}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{active.id}</span>
                    <Badge variant="outline" className={severityStyles[active.severity]}>{active.severity}</Badge>
                    <Badge variant="outline">{active.status}</Badge>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{active.title}</h2>
                  <div className="text-xs text-muted-foreground mt-1">
                    Opened {new Date(active.createdAt).toLocaleString()} · {active.assignee ?? <span className="text-warning">Unassigned</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Contain</Button>
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Assign incident
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-gradient-primary grid place-items-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <CardTitle className="text-base">AI Explanation</CardTitle>
                <Badge variant="outline" className="ml-auto border-primary/30 text-primary">94% confidence</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/90">{active.aiExplanation}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-success" />
                  <CardTitle className="text-base">Suggested Remediation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {active.remediation.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="h-6 w-6 rounded-full bg-success/15 text-success grid place-items-center text-xs font-semibold shrink-0 border border-success/30">
                        {i + 1}
                      </div>
                      <span className="text-foreground/90 leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ol>
                <Button variant="outline" size="sm" className="w-full mt-4 border-success/30 text-success hover:bg-success/10">
                  Run automated playbook
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Timeline</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4 pl-5 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-border">
                  {active.timeline.map((t, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[18px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                      <div className="text-xs text-muted-foreground">{t.time} · {t.actor}</div>
                      <div className="text-sm font-medium mt-0.5">{t.event}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
