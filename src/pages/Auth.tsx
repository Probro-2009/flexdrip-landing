import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, Sparkles, ArrowLeft, Instagram, Facebook, Twitter } from "lucide-react";

/**
 * FlexDrip — Auth Page (Login / Sign‑Up)
 * - Matches the glassmorphic, Apple‑like theme used on the landing page
 * - 3D tilt card, animated gradient blobs, soft depth
 * - Mobile‑first, fully responsive
 */

function cn(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

// 3D Tilt container
const Tilt: React.FC<{ className?: string; children: React.ReactNode; glare?: boolean }>
= ({ className = "", children, glare = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<any>({});

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left; const py = e.clientY - r.top;
    const rx = ((py - r.height / 2) / r.height) * -10;
    const ry = ((px - r.width / 2) / r.width) * 10;
    const gx = (px / r.width) * 100; const gy = (py / r.height) * 100;
    setStyle({
      transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015,1.015,1.015)`,
      background: glare ? `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14), transparent 45%)` : undefined,
    });
  };

  const onLeave = () => setStyle({ transform: "perspective(1000px) rotateX(0) rotateY(0)" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-200 will-change-transform",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

const Bg = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/30 to-rose-500/30 blur-3xl" />
    <div className="absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-sky-500/25 via-emerald-500/25 to-lime-500/25 blur-3xl" />
    <div className="absolute bottom-[-8rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-tl from-yellow-400/20 via-orange-500/20 to-rose-500/20 blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_-10%,rgba(255,255,255,0.25),transparent)]" />
  </div>
);

const Pill = ({ active, onClick, icon: Icon, children }:{ active?: boolean; onClick?: ()=>void; icon?: any; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
      "border border-white/15 backdrop-blur",
      active ? "bg-white/20 text-white ring-2 ring-fuchsia-400/60" : "bg-white/10 text-white/90 hover:bg-white/15"
    )}
  >
    {Icon ? <Icon className="h-4 w-4" /> : null}
    {children}
  </button>
);

const TextInput = ({ label, type = "text", icon: Icon, value, onChange, name }:{
  label: string;
  type?: string;
  icon?: any;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
}) => (
  <label className="group relative block">
    <span className="pointer-events-none absolute left-3 top-2.5 inline-flex items-center gap-2 text-xs text-white/60">
      {Icon ? <Icon className="h-4 w-4 opacity-80" /> : null}
      {label}
    </span>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className="w-full rounded-xl border border-white/15 bg-white/10 px-3 pt-7 pb-2 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur focus:border-white/30"
      placeholder=" "
    />
  </label>
);

export default function FlexDripAuth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPwd, setShowPwd] = useState(false);

  const title = useMemo(() => (mode === "login" ? "Welcome back" : "Create your account"), [mode]);
  const subtitle = useMemo(
    () => (mode === "login" ? "Sign in to continue shopping" : "Join FlexDrip India in seconds"),
    [mode]
  );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-fuchsia-500/30">
      <Bg />

      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">FlexDrip India</div>
            <div className="text-[11px] text-white/60">Clothing that moves with you</div>
          </div>
        </div>
        <a href="/" className="hidden items-center gap-2 text-sm text-white/70 hover:text-white md:inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to store
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 pb-16 md:grid-cols-2">
        {/* Left intro / hero */}
        <div className="order-2 md:order-1">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-black tracking-tight md:text-5xl">
            {title}
          </motion.h1>
          <p className="mt-2 max-w-md text-white/70">{subtitle}. Secure, fast and private.</p>

          <div className="mt-6 flex items-center gap-2">
            <Pill active={mode === "login"} onClick={() => setMode("login")} icon={LogIn}>Login</Pill>
            <Pill active={mode === "signup"} onClick={() => setMode("signup")} icon={UserPlus}>Sign up</Pill>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-3 text-white/70">
            <Instagram className="h-5 w-5" />
            <Facebook className="h-5 w-5" />
            <Twitter className="h-5 w-5" />
            <span className="text-sm">@flexdrip_india • 25k+ happy shoppers</span>
          </div>
        </div>

        {/* Right form card with 3D tilt */}
        <div className="order-1 md:order-2">
          <Tilt className="mx-auto max-w-md">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900/40 to-slate-800/30 p-5 ring-1 ring-white/10">
              <div className="mb-5 flex items-center justify-between">
                <div className="text-base font-semibold text-white/90">
                  {mode === "login" ? "Sign in" : "Sign up"}
                </div>
                <div className="text-xs text-white/60">
                  {mode === "login" ? (
                    <>No account? <button className="underline underline-offset-4" onClick={() => setMode("signup")}>Create one</button></>
                  ) : (
                    <>Have an account? <button className="underline underline-offset-4" onClick={() => setMode("login")}>Sign in</button></>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                    onSubmit={(e) => { e.preventDefault(); alert("Login submitted"); }}
                  >
                    <TextInput label="Email" icon={Mail} name="email" />
                    <label className="group relative block">
                      <span className="pointer-events-none absolute left-3 top-2.5 inline-flex items-center gap-2 text-xs text-white/60">
                        <Lock className="h-4 w-4 opacity-80" /> Password
                      </span>
                      <input type={showPwd ? "text" : "password"} className="w-full rounded-xl border border-white/15 bg-white/10 px-3 pt-7 pb-2 text-sm text-white outline-none backdrop-blur focus:border-white/30" placeholder=" " />
                      <button type="button" className="absolute right-2 top-2.5 rounded-lg border border-white/10 bg-white/10 p-1 text-white/80 backdrop-blur hover:bg-white/20" onClick={() => setShowPwd((s) => !s)}>
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </label>

                    <div className="flex items-center justify-between text-xs text-white/70">
                      <label className="inline-flex items-center gap-2"><input type="checkbox" className="accent-fuchsia-400"/> Remember me</label>
                      <button type="button" className="underline underline-offset-4">Forgot password?</button>
                    </div>

                    <button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500/90 via-fuchsia-500/90 to-rose-500/90 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 shadow-xl hover:from-indigo-400 hover:via-fuchsia-400 hover:to-rose-400">
                      <LogIn className="h-4 w-4" /> Sign in
                    </button>

                    <div className="pt-2 text-center text-xs text-white/60">or continue with</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Google" },
                        { label: "Apple" },
                        { label: "Facebook" },
                      ].map((s, i) => (
                        <button key={i} className="rounded-xl border border-white/15 bg-white/10 py-2 text-xs font-medium text-white/80 backdrop-blur hover:bg-white/20">{s.label}</button>
                      ))}
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                    onSubmit={(e) => { e.preventDefault(); alert("Sign up submitted"); }}
                  >
                    <TextInput label="Full name" icon={UserPlus} name="name" />
                    <TextInput label="Email" icon={Mail} name="email" />
                    <label className="group relative block">
                      <span className="pointer-events-none absolute left-3 top-2.5 inline-flex items-center gap-2 text-xs text-white/60">
                        <Lock className="h-4 w-4 opacity-80" /> Password
                      </span>
                      <input type={showPwd ? "text" : "password"} className="w-full rounded-xl border border-white/15 bg-white/10 px-3 pt-7 pb-2 text-sm text-white outline-none backdrop-blur focus:border-white/30" placeholder=" " />
                      <button type="button" className="absolute right-2 top-2.5 rounded-lg border border-white/10 bg-white/10 p-1 text-white/80 backdrop-blur hover:bg-white/20" onClick={() => setShowPwd((s) => !s)}>
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </label>
                    <label className="group relative block">
                      <span className="pointer-events-none absolute left-3 top-2.5 inline-flex items-center gap-2 text-xs text-white/60">
                        <Lock className="h-4 w-4 opacity-80" /> Confirm password
                      </span>
                      <input type={showPwd ? "text" : "password"} className="w-full rounded-xl border border-white/15 bg-white/10 px-3 pt-7 pb-2 text-sm text-white outline-none backdrop-blur focus:border-white/30" placeholder=" " />
                    </label>

                    <button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500/90 via-fuchsia-500/90 to-rose-500/90 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 shadow-xl hover:from-indigo-400 hover:via-fuchsia-400 hover:to-rose-400">
                      <UserPlus className="h-4 w-4" /> Create account
                    </button>

                    <div className="pt-2 text-center text-xs text-white/60">or sign up with</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Google" },
                        { label: "Apple" },
                        { label: "Facebook" },
                      ].map((s, i) => (
                        <button key={i} className="rounded-xl border border-white/15 bg-white/10 py-2 text-xs font-medium text-white/80 backdrop-blur hover:bg-white/20">{s.label}</button>
                      ))}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-5 text-center text-[11px] text-white/50">
                By continuing you agree to our <a className="underline underline-offset-4" href="#">Terms</a> & <a className="underline underline-offset-4" href="#">Privacy</a>.
              </div>
            </div>
          </Tilt>
        </div>
      </main>
    </div>
  );
}
