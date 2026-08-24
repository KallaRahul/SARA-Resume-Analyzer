import { useState } from "react";
import { Sun, Moon, Check, Sparkles, User, KeyRound, Palette } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/UIContext";
import { authApi } from "@/api/auth";
import { cn } from "@/lib/utils";

function FieldLabel({ children }) {
  return (
    <label className="text-xs font-bold text-[var(--ink)] mb-1.5 block uppercase tracking-wider">
      {children}
    </label>
  );
}

function ProfileSection() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const dirty = name.trim() !== (user?.name || "") && name.trim().length > 0;

  async function onSave(e) {
    e.preventDefault();
    if (!dirty) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Couldn't update profile", err?.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl max-w-2xl">
      <CardHeader className="!mb-4">
        <div>
          <CardTitle className="text-base font-bold font-display flex items-center gap-2">
            <User size={18} className="text-emerald-400" />
            Candidate Profile
          </CardTitle>
          <CardDescription className="mt-1">
            Your display name and account credentials for AI reports
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={onSave} className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shrink-0">
            {(user?.name?.[0] || "C").toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--ink)]">{user?.name || "Candidate"}</div>
            <div className="text-xs text-[var(--ink-muted)] mt-0.5">Avatar generated from account initial</div>
          </div>
        </div>

        <div>
          <FieldLabel>Full Name</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Your name"
            className="h-11 text-sm font-medium"
          />
        </div>

        <div>
          <FieldLabel>Email Address</FieldLabel>
          <Input value={user?.email || ""} disabled className="h-11 text-sm font-medium" />
          <p className="text-[11px] text-[var(--ink-muted)] mt-1.5 font-medium">
            Primary authentication email (managed by workspace admin).
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="accent" disabled={!dirty || saving} className="font-bold">
            {saving ? "Saving..." : "Save Profile Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ThemeOption({ value, label, icon: Icon, current, onSelect }) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex-1 flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all duration-200",
        active
          ? "border-emerald-500/50 bg-emerald-500/15 shadow-xl scale-[1.02]"
          : "border-[var(--glass-border)] bg-slate-900/40 hover:bg-slate-900/60"
      )}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
          active
            ? "bg-emerald-400 text-slate-950 shadow-md"
            : "bg-white/10 text-[var(--ink-muted)]"
        )}
      >
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-bold text-[var(--ink)]">{label} Mode</div>
        <div className="text-xs text-[var(--ink-muted)] mt-1 font-medium">
          {value === "light" ? "Alabaster clean aesthetic" : "Obsidian dark glassmorphism"}
        </div>
      </div>
      {active && (
        <span className="absolute top-4 right-4 h-6 w-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-md">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  return (
    <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl max-w-2xl">
      <CardHeader className="!mb-4">
        <div>
          <CardTitle className="text-base font-bold font-display flex items-center gap-2">
            <Palette size={18} className="text-emerald-400" />
            Theme & Aesthetic Modes
          </CardTitle>
          <CardDescription className="mt-1">
            Choose your preferred workspace interface mode
          </CardDescription>
        </div>
      </CardHeader>

      <div className="flex gap-4">
        <ThemeOption
          value="light"
          label="Alabaster Light"
          icon={Sun}
          current={theme}
          onSelect={setTheme}
        />
        <ThemeOption
          value="dark"
          label="Obsidian Dark"
          icon={Moon}
          current={theme}
          onSelect={setTheme}
        />
      </div>
    </Card>
  );
}

function PasswordSection() {
  const toast = useToast();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const newTooShort = newPassword.length > 0 && newPassword.length < 8;
  const mismatch = confirm.length > 0 && confirm !== newPassword;
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirm === newPassword &&
    !saving;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast.error("Couldn't change password", err?.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl max-w-2xl">
      <CardHeader className="!mb-4">
        <div>
          <CardTitle className="text-base font-bold font-display flex items-center gap-2">
            <KeyRound size={18} className="text-emerald-400" />
            Security & Password
          </CardTitle>
          <CardDescription className="mt-1">
            Update your account password (minimum 8 characters)
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <FieldLabel>Current Password</FieldLabel>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            className="h-11"
          />
        </div>

        <div>
          <FieldLabel>New Password</FieldLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            className="h-11"
          />
          {newTooShort && (
            <p className="text-xs font-semibold text-rose-400 mt-1.5">
              Password must be at least 8 characters.
            </p>
          )}
        </div>

        <div>
          <FieldLabel>Confirm New Password</FieldLabel>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className="h-11"
          />
          {mismatch && (
            <p className="text-xs font-semibold text-rose-400 mt-1.5">
              Passwords do not match.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="accent" disabled={!canSubmit} className="font-bold">
            {saving ? "Updating..." : "Update Security Password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Settings"
        description="Manage candidate profile, theme appearance, and password security."
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="appearance">Appearance Mode</TabsTrigger>
          <TabsTrigger value="password">Security & Auth</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
          <TabsContent value="appearance">
            <AppearanceSection />
          </TabsContent>
          <TabsContent value="password">
            <PasswordSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
