import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail, Lock, LogOut } from "lucide-react";
import {
  AuthShell,
  AuthField,
  AuthPrimaryButton,
  AuthErrorBanner,
} from "@/components/auth/AuthShell";
import { BrandLogo } from "@/components/layout/AILogo";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { user, login, logout } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: user?.email || "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      headline={
        <>
          Accelerate your career with <span className="text-gradient-emerald">AI Resume Intelligence.</span>
        </>
      }
      subhead="Audit ATS compliance, optimize impact bullets, and outperform recruiter filters in minutes."
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <BrandLogo showText={true} size="lg" />
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          Welcome back
        </h1>
        <p className="text-[var(--ink-muted)] mt-1.5 text-sm font-medium">
          Sign in to access your resumes vault & AI tools.
        </p>

        {user && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
            <span className="text-emerald-300 font-medium truncate">
              Signed in as <strong>{user.name}</strong> ({user.email})
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30 flex items-center gap-1 shrink-0 ml-2"
            >
              <LogOut size={12} /> Switch
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="you@example.com"
            icon={Mail}
          />

          <AuthField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="••••••••"
            icon={Lock}
          />

          <AuthErrorBanner>{err}</AuthErrorBanner>

          <div className="pt-1">
            <AuthPrimaryButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight size={15} />
                </>
              )}
            </AuthPrimaryButton>
          </div>
        </form>

        <div className="text-sm text-[var(--ink-muted)] text-center mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--accent-strong)] font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </AuthShell>
  );
}
