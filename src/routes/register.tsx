import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, Lock, Mail, User, Building2, ArrowRight, Check } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const perks = [
  "Unlimited threat correlation",
  "AI incident summaries & playbooks",
  "Wazuh, Splunk, Sentinel connectors",
  "14-day free trial · no credit card",
];

function RegisterPage() {
  const nav = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); nav({ to: "/dashboard" }); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center">
              <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="text-lg font-semibold">Sentinel AI</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create your workspace</h2>
            <p className="text-sm text-muted-foreground mt-1">Spin up a SOC in under 5 minutes</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fn">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="fn" className="pl-9 bg-secondary/40" placeholder="Alex" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ln">Last name</Label>
                <Input id="ln" className="bg-secondary/40" placeholder="Chen" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Organization</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="org" className="pl-9 bg-secondary/40" placeholder="Acme Corp" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9 bg-secondary/40" placeholder="alex@acme.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="pw" type="password" className="pl-9 bg-secondary/40" placeholder="At least 12 characters" />
              </div>
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded ${i <= 3 ? "bg-success" : "bg-secondary"}`} />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 glow">
              Create workspace <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            By signing up you agree to our Terms and Privacy Policy.
          </p>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-center p-12 bg-sidebar overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 via-transparent to-primary/20" />
        <div className="relative z-10 max-w-md space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-xs text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Trusted by 400+ security teams
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Your SOC, <span className="text-gradient">supercharged</span> by AI.
          </h1>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-success/20 grid place-items-center mt-0.5 shrink-0">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5">
            <p className="text-sm leading-relaxed text-foreground/90">
              "Sentinel turned a 4-hour triage into a 6-minute Slack thread. It's the first AI tool our team actually trusts."
            </p>
            <div className="mt-3 text-xs text-muted-foreground">— Priya Raman, CISO at Northwind</div>
          </div>
        </div>
      </div>
    </div>
  );
}
