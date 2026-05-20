import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ShieldAlert, Siren, Settings, Search, Bell, LogOut,
  Sparkles, Shield, Activity, Send,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alerts", label: "Alerts", icon: ShieldAlert, badge: 12 },
  { to: "/incidents", label: "Incidents", icon: Siren, badge: 3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [aiOpen, setAiOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60" />
            <div className="relative h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center">
              <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="font-semibold tracking-tight text-sidebar-foreground">Sentinel AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">SOC Platform</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-primary shadow-card"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="outline" className="border-critical/40 bg-critical/15 text-critical text-[10px] h-5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">AC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Alex Chen</div>
              <div className="text-xs text-muted-foreground truncate">SOC Analyst · L3</div>
            </div>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-sm flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search threats, IOCs, hosts…" className="pl-9 bg-background/60 border-border" />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-success">All systems operational</span>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-critical animate-pulse" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiOpen((v) => !v)}
              className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex min-w-0">
          <main className="flex-1 min-w-0 p-4 lg:p-6">
            <Outlet />
          </main>
          {aiOpen && <AssistantPanel onClose={() => setAiOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi Alex — I'm monitoring 1,284 endpoints. 3 incidents need your attention. Ask me anything." },
    { role: "ai", text: "Top concern right now: INC-2041 (Ransomware staging on FIN-DB-02). I've drafted a containment playbook." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: input },
      { role: "ai", text: "Correlating telemetry across Wazuh, EDR, and firewall logs… I'll surface findings in a moment." },
    ]);
    setInput("");
  };

  return (
    <aside className="hidden xl:flex w-80 flex-col border-l border-border bg-card/40 backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-gradient-primary grid place-items-center">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Sentinel AI</div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Activity className="h-2.5 w-2.5" /> Online · GPT-5 reasoning
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 px-2 text-xs">×</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm ${m.role === "user" ? "ml-6" : "mr-6"}`}>
            <div className={`text-[10px] uppercase tracking-wider mb-1 ${m.role === "user" ? "text-right text-muted-foreground" : "text-primary"}`}>
              {m.role === "user" ? "You" : "Sentinel"}
            </div>
            <div className={`rounded-lg px-3 py-2 ${m.role === "user" ? "bg-primary/15 text-foreground" : "bg-secondary/60 text-foreground/90"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {["Summarize last 24h", "Explain INC-2041", "Block source IP"].map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-[11px] px-2 py-1 rounded-full border border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Sentinel…"
            className="bg-background/60 text-sm"
          />
          <Button size="icon" onClick={send} className="bg-gradient-primary hover:opacity-90">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
