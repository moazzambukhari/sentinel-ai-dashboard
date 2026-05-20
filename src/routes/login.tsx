import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, Github } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); nav({ to: "/dashboard" }); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-sidebar overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center glow">
            <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">Sentinel AI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Security Operations</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            AI-powered threat intelligence
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Detect, investigate, and contain threats <span className="text-gradient">10x faster</span>.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sentinel AI correlates signals across your stack, summarizes incidents in plain English, and ships recommended remediation in seconds.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[["1.2M+", "events/hour"], ["98.4%", "true positive"], ["<3min", "MTTD"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-semibold text-foreground">{v}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          SOC 2 Type II · ISO 27001 · GDPR
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center">
              <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="text-lg font-semibold">Sentinel AI</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your SOC workspace</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="analyst@sentinel.ai" className="pl-9 bg-secondary/40" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pw">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="pw" type={show ? "text" : "password"} defaultValue="••••••••••" className="pl-9 pr-9 bg-secondary/40" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-muted-foreground font-normal">Keep me signed in for 30 days</Label>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 glow">
              Sign in <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="bg-secondary/40"><Github className="h-4 w-4 mr-2" /> GitHub</Button>
            <Button variant="outline" className="bg-secondary/40">SSO / SAML</Button>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            New to Sentinel? <Link to="/register" className="text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
