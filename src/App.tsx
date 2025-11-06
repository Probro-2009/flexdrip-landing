import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shirt,
  Sparkles,
  ShoppingCart,
  Truck,
  BadgeCheck,
  Search,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
  Star,
  Baby,
  Layers,
  Youtube, 
  ChevronLeft, 
  ArrowRight
} from "lucide-react";
// ✅ Vite 5/6-friendly
const ASSETS = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImg = (name: string) =>
  Object.entries(ASSETS).find(([k]) => k.endsWith("/" + name))?.[1] as string;


/**
 * FlexDrip India — Landing Page
 * - Glassmorphism + subtle 3D tilt
 * - TailwindCSS styling
 * - Apple-like soft gradients and depth
 * - Men / Women / Kids categories
 */
// ---------- Small UI helpers ----------
function cn(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

const Badge = ({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md shadow-sm">
    {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
    {children}
  </span>
);

const PrimaryButton = ({ children, className = "", ...props }: any) => (
  <button
    className={cn(
      "group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white",
      "bg-gradient-to-r from-indigo-500/90 via-fuchsia-500/90 to-rose-500/90",
      "hover:from-indigo-400 hover:via-fuchsia-400 hover:to-rose-400",
      "shadow-xl shadow-fuchsia-900/20 ring-1 ring-white/20 backdrop-blur",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </button>
);
// --- AdSlot (drop-in) ---
import { useEffect, useRef } from "react";

function AdSlot({ width = 300, height = 250, title = "Sponsored" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Reserve space to avoid layout shift
    ref.current.style.minWidth = width + "px";
    ref.current.style.minHeight = height + "px";

    (window as any).atOptions = {
      key: "9caf044441968aa85cb4c843dd6c7f85",
      format: "iframe",
      height,
      width,
      params: {},
    };

    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "//www.highperformanceformat.com/9caf044441968aa85cb4c843dd6c7f85/invoke.js";
    s.async = true;
    ref.current.appendChild(s);

    return () => {
      try { if (ref.current) ref.current.innerHTML = ""; } catch {}
    };
  }, [width, height]);

  return (
    <div className="mx-auto my-10 w-[300px]">
      <div className="mb-1 text-[11px] uppercase tracking-wide text-white/45">{title}</div>
      <div
        ref={ref}
        className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur"
      />
    </div>
  );
}

// Tilt card for 3D effect
const TiltCard: React.FC<{
  className?: string;
  children: React.ReactNode;
  glare?: boolean;
}> = ({ className = "", children, glare = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<any>({});

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const xRot = ((py - rect.height / 2) / rect.height) * -10;
    const yRot = ((px - rect.width / 2) / rect.width) * 10;
    const transform = `perspective(900px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.02,1.02,1.02)`;

    const gx = (px / rect.width) * 100;
    const gy = (py / rect.height) * 100;
    setStyle({
      transform,
      background: glare
        ? `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15), transparent 45%)`
        : undefined,
    });
  };

  const onLeave = () => setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl",
        "transition-transform duration-200 will-change-transform",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

// ---------- Decorative background blobs ----------
const Bg = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/30 to-rose-500/30 blur-3xl" />
    <div className="absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-sky-500/25 via-emerald-500/25 to-lime-500/25 blur-3xl" />
    <div className="absolute bottom-[-8rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-tl from-yellow-400/20 via-orange-500/20 to-rose-500/20 blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_-10%,rgba(255,255,255,0.25),transparent)]" />
  </div>
);

/** Shared height for both cards (Create + Social) */
const HOME_CARD_H = "min-h-[360px]"; // adjust once and both stay equal

type Platform = "YouTube" | "Instagram" | "X";
type SocialItem = {
  id: string;
  platform: Platform;
  title: string;
  note?: string;
  href?: string;
};

const SOCIAL_ITEMS: SocialItem[] = [
  { id: "yt-01", platform: "YouTube",   title: "DTG vs AOP — quick guide",  note: "New",    href: "#" },
  { id: "ig-01", platform: "Instagram", title: "Behind the print — Neon",   note: "Reel",   href: "#" },
  { id: "x-01",  platform: "X",         title: "Launch week updates",       note: "Thread", href: "#" },
  { id: "yt-02", platform: "YouTube",   title: "Making the ₹699 tee",       note: "Shorts", href: "#" },
  { id: "ig-02", platform: "Instagram", title: "Customer drip showcase",    note: "Stories",href: "#" },
];

function platformIcon(p: Platform, cls = "h-5 w-5 opacity-80") {
  if (p === "YouTube") return <Youtube className={cls} />;
  if (p === "Instagram") return <Instagram className={cls} />;
  return <Twitter className={cls} />;
}

function SocialCard({ item }: { item: SocialItem }) {
  return (
    <a href={item.href || "#"} className="group block select-none">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            {platformIcon(item.platform)} {item.platform}
          </span>
          {item.note && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">{item.note}</span>
          )}
        </div>

        {/* media placeholder */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] h-40 grid place-items-center">
          <div className="opacity-60">{platformIcon(item.platform, "h-7 w-7 opacity-60")}</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-white/90 font-medium">{item.title}</div>
            <div className="text-xs text-white/60">Clickable — embed later</div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/10">
            View <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}

function SocialPresenceSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(900, el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    // let the smooth scroll finish then sync
    setTimeout(syncEdges, 350);
  };

  return (
    <section className={`relative ${HOME_CARD_H}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold text-white/95">FlexDrip <span className="text-white/60">on</span> Social</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollByCards("left")}
            disabled={atStart}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollByCards("right")}
            disabled={atEnd}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Custom slider — hidden scrollbar */}
      <div
        ref={scrollerRef}
        onScroll={syncEdges}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none"
      >
        {SOCIAL_ITEMS.map((item) => (
          <div key={item.id} className="min-w-[320px] md:min-w-[360px] snap-start">
            <SocialCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
//Newsletter//
function NewsletterCard() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log("Newsletter signup:", {
      name: fd.get("name"),
      email: fd.get("email"),
    });
    // TODO: hook to your backend / email service
    alert("Thanks for signing up! 🎉");
    e.currentTarget.reset();
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="text-white/90 text-lg font-semibold">Sign up for drops & deals</h3>
      <p className="text-white/60 text-sm mt-1">
        Get early access to new designs, limited runs, and ₹-off launch offers. 1–2 emails/month.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input name="name" placeholder="Your name" className="input-glass" required />
        <input name="email" type="email" placeholder="Email address" className="input-glass" required />
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2.5 text-white font-medium shadow-lg shadow-fuchsia-500/10"
        >
          Sign up
        </button>
        <p className="text-[11px] text-white/45">
          By signing up, you agree to receive FlexDrip marketing emails. Unsubscribe anytime.
        </p>
      </form>
    </section>
  );
}
//Newsletter End//
// ---------- Main Component ----------
export function App() {
  const [activeCat, setActiveCat] = useState<"Men" | "Women" | "Kids">("Men");
  // turn "Men" | "Women" | "Kids" into "/men" | "/women" | "/kids"
const catPath = `/${activeCat.toLowerCase()}`;


  const nav = [
    { name: "Men", icon: Shirt },
    { name: "Women", icon: Layers },
    { name: "Kids", icon: Baby },
  ] as const;

  const products = useMemo(() => {
  const base = [
    { title: "Oversized Tee — Neon Wave",  price: "₹499",  tag: "New",       image: "tshirt1.jpg" },
    { title: "Classic Polo — Cloud Gray", price: "₹699",  tag: "Bestseller", image: "tshirt2.jpg" },
    { title: "Athleisure Hoodie — Nightfall", price: "₹1,299", tag: "Limited", image: "tshirt3.jpg" },
  ];
  if (activeCat === "Women") {
    base[0] = { ...base[0], title: "Crop Tee — Aurora Fade", image: "tshirt4.jpg" };
    base[1] = { ...base[1], title: "Relaxed Fit Tee — Pearl", image: "tshirt5.jpg" };
  }
  if (activeCat === "Kids") {
    base[0] = { ...base[0], title: "Kids Tee — Dino Party", image: "tshirt6.jpg" };
    base[1] = { ...base[1], title: "Kids Hoodie — Star Pop", image: "tshirt7.jpg" };
  }
  return base;
}, [activeCat]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-fuchsia-500/30">
      <Bg />

      {/* Nav */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">FlexDrip India</div>
            <div className="text-xs text-white/60">Clothing that moves with you</div>
          </div>
        </div>
        <nav className="hidden gap-2 md:flex">
          {nav.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveCat(name as any)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
                "border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10",
                activeCat === name ? "ring-2 ring-fuchsia-400/60" : ""
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm backdrop-blur md:flex">
            <Search className="h-4 w-4 opacity-80" />
            <input
              placeholder="Search tees, hoodies, polos…"
              className="bg-transparent outline-none placeholder:text-white/50"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-2 backdrop-blur hover:bg-white/20">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-black tracking-tight md:text-6xl"
            >
              Wear the <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">next layer</span> of comfort.
            </motion.h1>
            <p className="max-w-xl text-base text-white/70 md:text-lg">
              Premium fabrics. Street‑ready designs. Sizes for <span className="font-semibold text-white">Men, Women, and Kids</span> — printed on demand and shipped across India.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge icon={Truck}>Free shipping over ₹999</Badge>
              <Badge icon={BadgeCheck}>7‑day easy returns</Badge>
              <Badge icon={Star}>4.8/5 community rated</Badge>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to={catPath} className="inline-flex items-center rounded-full px-5 py-3 font-semibold
  bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400
  shadow-lg shadow-pink-500/20">
  Shop {activeCat}
</Link>

              <button className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/20">
                Customize & Print
              </button>
            </div>
          </div>

          {/* 3D product cluster */}
          <div className="relative h-[420px] md:h-[520px]">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-xl" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="absolute left-2 top-6 w-56 md:left-8 md:w-72"
            >
              <TiltCard className="aspect-[4/5]">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/30 p-4 ring-1 ring-white/10">

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Oversized Tee</span>
                    <span>₹499</span>
                  </div>
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-white/5">
                    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-white/5 overflow-hidden">
                      <img
                        src={getImg("tshirt2.jpg")}
                        alt="Kids Tee — Dino Party"
                        className="h-full w-full object-contain"
                             />
                     </div>
                  </div>
                  <div className="text-sm font-semibold">Neon Wave</div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute right-3 top-24 w-48 md:right-10 md:w-64"
            >
              <TiltCard className="aspect-[4/5]">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/30 p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Hoodie</span>
                    <span>₹1,299</span>
                  </div>
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-white/5">
                   <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-white/5 overflow-hidden">
                       <img
                          src={getImg("tshirt3.jpg")}
                          alt="Athleisure Hoodie — Nightfall"
                          className="h-full w-full object-contain"
                            />
                    </div>

                  </div>
                  <div className="text-sm font-semibold">Nightfall</div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="absolute left-1/2 bottom-4 w-44 -translate-x-1/2 md:w-56"
            >
              <TiltCard className="aspect-[4/5]">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-800/30 p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Kids Tee</span>
                    <span>₹399</span>
                  </div>
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-white/5">
                    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-white/5 overflow-hidden">
                      <img
                      src={getImg("tshirt1.jpg")}
                     alt="Kids Tee — Dino Party"
                      className="h-full w-full object-contain"
                           />
                   </div>

                  </div>
                  <div className="text-sm font-semibold">Dino Party</div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category rail */}
      <section className="mx-auto mt-14 w-full max-w-7xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">Featured — {activeCat}</h2>
          <Link to={catPath} className="text-sm text-white/70 hover:text-white/90">
  View all
</Link>

        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <TiltCard className="group">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between text-xs text-white/70">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5">{p.tag}</span>
                    <span>{p.price}</span>
                  </div>
                 <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                     <img
                       src={getImg(p.image)}
                       alt={p.title}
                       className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                       loading="lazy"
                         />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{p.title}</div>
                      <div className="text-xs text-white/60">100% combed cotton</div>
                    </div>
                    <PrimaryButton className="px-3 py-2 text-xs">Add</PrimaryButton>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Build-your-own / CTA */}
      {/* Build-your-own / CTA + Social + Why + Newsletter */}
<section className="mx-auto mt-16 w-full max-w-7xl px-6 space-y-6">

  {/* Row 1 — Create + Social (equal height) */}
  <div className="grid gap-6 md:grid-cols-3">
    {/* Create your drip (span 2) */}
 {/* Create your drip (span 2) — perfectly even, no leftover space */}
<TiltCard className="md:col-span-2 min-h-[360px]">
  <div className="h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-6 ring-1 ring-white/10">
    {/* Full-height, two equal columns */}
    <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      
      {/* Left: text block fills height */}
      <div className="flex h-full flex-col">
        <h3 className="text-xl font-bold">Create your drip</h3>

        <p className="mt-1 max-w-prose text-sm text-white/70">
          Launch designs in minutes—upload high-res PNG/SVG (transparent or solid) and pick
          <span className="text-white/85"> AOP</span> or <span className="text-white/85">DTG</span>. We print with eco-friendly,
          water-based inks for a soft hand feel, then ship pan-India with tracking.
        </p>

        <ul className="mt-3 space-y-1.5 text-sm text-white/65 list-disc pl-5">
          <li>Best at 300&nbsp;DPI • up to 25&nbsp;MB</li>
          <li>Sizes XS–7XL • men/women/unisex</li>
          <li>Multiple colourways & mockups</li>
          <li>Dispatch 2–4 business days</li>
          <li>Easy reprints for defects</li>
        </ul>

        <div className="mt-4 flex gap-2">
          <PrimaryButton>Start Designing</PrimaryButton>
          <button className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur hover:bg-white/20">
            See Templates
          </button>
        </div>

        {/* keep content pinned to top; ensures column stretches to full height */}
        <div className="mt-auto" />
      </div>

      {/* Right: preview/placeholder fills entire column height */}
      <div className="flex h-full items-center justify-center">
        <div className="h-full w-full rounded-2xl border border-white/10 bg-white/10 grid place-items-center">
          <div className="w-full h-45 md:h-60 rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
  <img src={getImg("tshirt2.jpg")} alt="Showcase" className="h-full w-full object-cover" />
</div>

        </div>
      </div>

    </div>
  </div>
</TiltCard>


    {/* Social — custom slider; wrapped to enforce same height */}
    <div className="min-h-[360px]">
      <SocialPresenceSection />
    </div>
  </div>
{/* ROW 2 — Why (top-left) + Offers (bottom-left) + Newsletter (top-right same height as Why) */}
<div className="grid gap-6 md:grid-cols-3">
  {/* Left column is two stacked cards (50/50) */}
  <div className="md:col-span-2 grid grid-rows-2 gap-6">
    {/* Why FlexDrip? (top half) */}
    <TiltCard className="h-full min-h-[260px]">
  <div className="h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-6 ring-1 ring-white/10">
    <div className="grid h-full gap-6 md:grid-cols-2">
      {/* text */}
      <div>
        <h4 className="mb-1 text-base font-semibold">Why FlexDrip?</h4>
        <ul className="space-y-2 text-sm text-white/75 list-disc pl-5">
          <li>Eco-friendly, water-based inks</li>
          <li>Smart fit & soft-hand feel</li>
          <li>100% pure, made-in-India cotton clothes</li>
          <li>Available in all sizes — XS to 7XL</li>
          <li>Available in a variety of colours</li>
        </ul>
      </div>

      {/* image placeholder (right side) */}
      <div className="hidden md:flex items-center justify-center">
        <div className="w-full h-45 md:h-60 rounded-2xl border border-white/10 bg-white/10 grid place-items-center">
          <div className="w-full h-45 md:h-60 rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
  <img src={getImg("tshirt1.jpg")} alt="Showcase" className="h-full w-full object-cover" />
</div>

        </div>
      </div>
    </div>
  </div>
</TiltCard>


    {/* Current offers (bottom half) */}
    <TiltCard className="h-full min-h-[260px]">
  <div className="h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-6 ring-1 ring-white/10">
    <div className="grid h-full gap-6 md:grid-cols-2">
      {/* left: offers list */}
      <div className="flex flex-col">
        <h4 className="mb-3 text-base font-semibold text-white/90">Current offers</h4>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">₹699 AOP tees</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">Buy 2 Get 5% off</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">Free shipping ₹999+</span>
        </div>

        <ul className="mt-3 space-y-2 text-sm text-white/75 list-disc pl-5">
          <li>New: Neon Wave drop this week</li>
          <li>Monsoon combo: Tee + Cap at ₹1099</li>
          <li>Students: extra 5% with EDU mail</li>
        </ul>

        <div className="mt-auto pt-4">
          <button className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm text-white shadow-lg shadow-fuchsia-500/10">
            View all offers
          </button>
        </div>
      </div>

      {/* right: image placeholder */}
      <div className="hidden md:flex items-center justify-center">
        <div className="w-full h-45 md:h-60 rounded-2xl border border-white/10 bg-white/10 grid place-items-center">
          <div className="w-full h-45 md:h-60 rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
  <img src={getImg("tshirt3.jpg")} alt="Showcase" className="h-full w-full object-cover" />
</div>

        </div>
      </div>
    </div>
  </div>
</TiltCard>

  </div>

  {/* Right column — Newsletter, same height as top-left (Why) */}
  <TiltCard className="min-h-[260px]">
  <div className="h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-6 ring-1 ring-white/10 flex flex-col">
    <h4 className="text-base font-semibold text-white/90">Sign up for drops & deals</h4>
    <p className="text-sm text-white/60 mt-1">
      Get early access to new designs, limited runs, and launch offers. 1–2 emails/month.
    </p>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        console.log("Newsletter:", { name: f.get("name"), email: f.get("email") });
        alert("Thanks for signing up! 🎉");
        e.currentTarget.reset();
      }}
      className="mt-4 space-y-3"
    >
      <input name="name" placeholder="Your name" className="input-glass" required />
      <input name="email" type="email" placeholder="Email address" className="input-glass" required />
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2.5 text-white font-medium shadow-lg shadow-fuchsia-500/10"
      >
        Sign up
      </button>
      <p className="text-[11px] text-white/45">
        By signing up, you agree to receive FlexDrip emails. Unsubscribe anytime.
      </p>
    </form>

    {/* bottom image placeholder */}
    <div className="mt-auto">
      <div className="mt-4 h-60 rounded-4xl border border-white/10 bg-white/10 grid place-items-center">
        <div className="w-full h-45 md:h-60 rounded-2xl border border-white/10 bg-white/10 overflow-hidden">
  <img src={getImg("tshirt1.jpg")} alt="Showcase" className="h-full w-full object-cover" />
</div>

      </div>
    </div>
  </div>
</TiltCard>

</div>

</section>


      {/* Social proof */}
      <section className="mx-auto mt-14 w-full max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/70">
            <Star className="h-5 w-5" />
            <span className="text-sm">Loved by 25k+ customers</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Instagram className="h-5 w-5" />
            <Facebook className="h-5 w-5" />
            <Twitter className="h-5 w-5" />
            <span className="text-sm">@flexdrip_india</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-16 w-full max-w-7xl px-6 pb-16 pt-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-2 text-lg font-extrabold">FlexDrip India</div>
            <p className="text-sm text-white/70">Made in India • Ships nationwide</p>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">Shop</div>
            <ul className="space-y-1 text-sm text-white/70">
              <li>Men</li>
              <li>Women</li>
              <li>Kids</li>
              <li>Accessories</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">Support</div>
            <ul className="space-y-1 text-sm text-white/70">
              <li>Track Order</li>
              <li>Returns</li>
              <li>Size Guide</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">Legal</div>
            <ul className="space-y-1 text-sm text-white/70">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Shipping Policy</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} FlexDrip India. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


