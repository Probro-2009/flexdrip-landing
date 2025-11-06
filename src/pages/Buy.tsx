import { useMemo, useState, useEffect, useRef } from "react";

// replace the bad path
import { useCart } from "./cart";


import { CheckCheck, CreditCard, Landmark, Truck, ShieldCheck, QrCode, BadgeCheck, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const ASSETS = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});
const imgUrl = (file: string) =>
  Object.entries(ASSETS).find(([k]) => k.endsWith("/" + file))?.[1] as string;
  const iconUrl = (base: string) => imgUrl(`${base}.svg`) ?? imgUrl(`${base}.jpg`);


type NavItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty?: number;
};

export default function Buy() {
  const cart = useCart();
  const location = useLocation();
  const single: NavItem | undefined = (location.state as any)?.buyOne;

  // If navigated from “Buy now” → show only that item; else show cart
  const items = useMemo(() => {
    if (single) return [{ ...single, qty: single.qty ?? 1 }];
    return cart.items;
  }, [single, cart.items]);

  const payable = items.reduce((s, p) => s + p.price * (p.qty ?? 1), 0);
// add to the import line at the top:
import { useMemo, useState, useEffect, useRef } from "react";

// --- AdSlot (safe loader + no CLS) ---
function AdSlot({ width = 300, height = 250, title = "Sponsored" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Reserve space
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
    s.src =
      "//www.highperformanceformat.com/9caf044441968aa85cb4c843dd6c7f85/invoke.js";
    s.async = true;
    ref.current.appendChild(s);

    return () => {
      try {
        if (ref.current) ref.current.innerHTML = "";
      } catch {}
    };
  }, [width, height]);

  return (
    <div className="mx-auto my-8 w-[300px]">
      <div className="mb-1 text-[11px] uppercase tracking-wide text-white/45">
        {title}
      </div>
      <div
        ref={ref}
        className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur"
      />
    </div>
  );
}

  // modal
  const [showPay, setShowPay] = useState(false);
  const upiNumber = "9869345997";

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <header className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-lg font-semibold">Checkout</div>
          <div className="text-sm text-white/70">Paying to <span className="font-semibold">FlexDrip India</span> <BadgeCheck className="inline h-4 w-4 text-emerald-400 translate-y-[2px]" title="Verified"/></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: items */}
        <section className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">Your cart is empty.</div>
          ) : (
            items.map((p) => {
              const mrp = p.price * 2;
              return (
                <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex gap-4">
                  <div className="h-24 w-24 rounded-lg overflow-hidden border border-white/10 bg-black/10 shrink-0">
                    <img src={imgUrl(p.image)} alt={p.title} className="h-full w-full object-cover"/>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-white/70 text-sm line-clamp-2">
                      Premium combed cotton with soft-hand print. Easy 7-day returns.  Delivery across India.
                    </div>
                    <div className="mt-1 text-sm text-white/80">Qty: {p.qty ?? 1}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-white/50 line-through">₹{mrp}</span>
                      <span className="font-semibold">₹{p.price}</span>
                    </div>
                  </div>
                  {!single && (
                    <button
                      onClick={() => cart.remove(p.id)}
                      className="self-start rounded-full px-3 py-1.5 text-sm bg-white/10 border border-white/15 hover:bg-white/20"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })
          )}

          {/* Info cards */}
          <div className="grid sm:grid-cols-3 gap-3">
            <InfoCard icon={<Truck className="h-4 w-4" />} title="Delivery">Free shipping on all orders.</InfoCard>
            <InfoCard icon={<ShieldCheck className="h-4 w-4" />} title="Returns">7-day easy returns.</InfoCard>
            <InfoCard icon={<CheckCheck className="h-4 w-4" />} title="Assurance">Quality checked before dispatch.</InfoCard>
          </div>
        </section>

        {/* Right: billing */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-20">
            <div className="text-lg font-semibold mb-4">Billing</div>

            {/* The math rules you requested */}
            <Row label="Products (MRP)">₹{(payable * 2).toFixed(0)}</Row>
            <Row label="Discount (50% of MRP)" valueClass="text-emerald-400">− ₹{(payable).toFixed(0)}</Row>
            <Row label="Delivery">Free</Row>
            <div className="my-3 border-b border-white/10" />
            <Row label="Total" strong>₹{payable.toFixed(0)}</Row>

            <button
              onClick={() => setShowPay(true)}
              className="mt-5 w-full rounded-full px-4 py-3 font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"
            >
              Pay now
            </button>

            {!single && cart.items.length > 0 && (
              <button
                onClick={() => cart.clear()}
                className="mt-3 w-full rounded-full px-4 py-2 text-sm font-semibold bg-white/10 border border-white/15 hover:bg-white/20"
              >
                Clear cart
              </button>
            )}
          </div>
           {/* Sponsored banner (300×250) under billing */}
  <AdSlot width={300} height={250} title="Sponsored" />
        </aside>
      </main>

      {/* Payment Modal */}
      {showPay && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowPay(false)} />
          <div className="absolute inset-0 p-6 flex justify-center items-start overflow-y-auto">
            <div className="w-full max-w-5xl rounded-2xl overflow-hidden border border-white/10 bg-[#111318] grid grid-cols-1 md:grid-cols-3">
              {/* Left fixed sidebar */}
              <div className="md:col-span-1 bg-black/30 p-6 border-r border-white/10">
                <div className="text-sm text-white/70 mb-1">Payable Amount</div>
                <div className="text-3xl font-extrabold">₹{payable.toFixed(0)}</div>
                <div className="mt-6 text-sm text-white/70">Paying to</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold">FlexDrip India</span>
                  <BadgeCheck className="h-4 w-4 text-emerald-400" title="Verified" />
                </div>
                <div className="mt-6 text-xs text-white/50">
                  Payments are securely processed. UPI available now; other methods coming soon.
                </div>
              </div>

              {/* Right content */}
              <div className="md:col-span-2 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold">Select a payment method</div>
                  <button
                    onClick={() => setShowPay(false)}
                    className="rounded-full px-3 py-1.5 text-sm bg-white/10 border border-white/15 hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* UPI */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <QrCode className="h-5 w-5" />
                      <div className="font-semibold">UPI</div>
                      <div className="ml-auto flex items-center gap-2 text-xs text-white/70">
                        <img src={iconUrl("gpay")}    alt="GPay"    className="h-4" />
                        <img src={iconUrl("bhim")}    alt="BHIM"    className="h-4" />
                        <img src={iconUrl("phonepe")} alt="PhonePe" className="h-4" />

                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-white/10 bg-black/20 p-3 grid place-items-center">
                        <img src={imgUrl("qr.jpg")} alt="UPI QR" className="max-h-64 object-contain" />
                      </div>
                      <div className="text-sm">
                        <div className="text-white/70">UPI number</div>
                        <div className="text-2xl font-bold mt-1">{upiNumber}</div>
                        <div className="text-white/70 mt-3">
                          Scan the QR with any UPI app (GPay / PhonePe / BHIM) or pay to the number above.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coming soon methods */}
                  <ComingSoon icon={<CreditCard className="h-5 w-5" />} title="Credit / Debit Card" />
                  <ComingSoon icon={<Landmark className="h-5 w-5" />} title="Netbanking" />
                  <ComingSoon icon={<Truck className="h-5 w-5" />} title="Cash on Delivery" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------ Small components ------ */
function Row({ label, children, strong, valueClass }: { label: string; children?: React.ReactNode; strong?: boolean; valueClass?: string }) {
  return (
    <div className="flex justify-between py-1.5">
      <div className="text-white/70">{label}</div>
      <div className={(strong ? "font-extrabold " : "font-semibold ") + (valueClass ?? "")}>{children}</div>
    </div>
  );
}
function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 font-semibold mb-1">{icon}{title}</div>
      <div className="text-white/70 text-sm">{children}</div>
    </div>
  );
}
function ComingSoon({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 opacity-70">
      <div className="flex items-center gap-2">
        {icon}
        <div className="font-semibold">{title}</div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/10">Coming soon</span>
      </div>
    </div>
  );
}
