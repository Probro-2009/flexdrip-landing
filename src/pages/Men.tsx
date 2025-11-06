// src/pages/Men.tsx
import { useMemo, useState } from "react";
import {
  Filter,
  Search,
  ChevronDown,
  Shirt,
  User,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./cart";

const ASSETS = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImg = (name: string) =>
  Object.entries(ASSETS).find(([k]) => k.endsWith("/" + name))?.[1] as
    | string
    | undefined;

const PAGE_SIZE = 24; // 3 x 8 grid (24 cards/page)
const TOTAL_PAGES = 5; // 1..5 pagination chips

type Item = {
  idx: number;
  title: string;
  price: number; // numeric for easy math (MRP etc.)
  image: string; // filename in /src/assets, e.g. tshirt1.jpg
  stock: boolean;
};

export default function Men() {
  const [page, setPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const nav = useNavigate();
  const cart = useCart();

  // Modal state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Item | null>(null);
  const [activeImg, setActiveImg] = useState<string | undefined>(undefined);
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

  // Build items for the current page
  const items = useMemo<Item[]>(
    () =>
      Array.from({ length: PAGE_SIZE }).map((_, i) => ({
        idx: page * PAGE_SIZE + i + 1,
        title: `Men's Design #${page * PAGE_SIZE + i + 1}`,
        price: 499 + ((i + page) % 8) * 100, // 499, 599, 699, ...
        image: `tshirt${((i + page) % 8) + 1}.jpg`,
        stock: Math.random() > 0.2,
      })),
    [page]
  );

  function openModal(p: Item) {
    setActive(p);
    const gallery = buildGallery(p.image);
    setActiveImg(gallery[0]);
    setOpen(true);
  }

  // Add to cart with default options (M, black) when pressing the card button
  function addToCartQuick(p: Item) {
    const id = `${p.image}-M-black`;
    cart.add(
      {
        id,
        title: `${p.title} (M, black)`,
        price: p.price,
        image: p.image,
      },
      1
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          {/* Brand icon placeholder */}
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500/60 to-purple-500/60 grid place-items-center border border-white/15">
            <Shirt className="h-4 w-4" />
          </div>

          {/* Brand name */}
          <Link to="/" className="text-lg font-semibold tracking-tight">
            FlexDrip India
          </Link>

          {/* Nav */}
          <nav className="ml-4 hidden md:flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10 border border-white/10"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-full text-sm bg-white/5 hover:bg-white/10 border border-white/10"
            >
              Contact
            </Link>
          </nav>

          {/* Right tools */}
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder="Search designs..."
                className="pl-9 pr-3 py-2 rounded-full bg-white/10 border border-white/10 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
              />
            </div>

            <button
              onClick={() => setShowFilter((s) => !s)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Filter"
              title="Filter"
            >
              <Filter className="h-5 w-5" />
            </button>

            {/* Cart button (between Filter and Profile) – navigates to /buy */}
            <button
              onClick={() => nav("/buy")}
              className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Cart"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-4 rounded-full bg-pink-500 text-[10px] grid place-items-center">
                  {cart.count}
                </span>
              )}
            </button>

            <button
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Profile"
              title="Profile"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Filter dropdown (visual only for now) */}
      {showFilter && (
        <div className="absolute right-6 mt-2 w-80 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 z-40 space-y-4">
          <FilterGroup
            title="Type"
            items={[
              "Hoodies",
              "Bomber Jacket",
              "Tshirts",
              "Oversized Tshirts",
              "Shirts",
              "Accessories",
            ]}
          />
          <FilterGroup
            title="Size"
            items={[
              "XS",
              "S",
              "M",
              "L",
              "XL",
              "XXL",
              "3XL",
              "4XL",
              "5XL",
              "6XL",
              "7XL",
            ]}
          />
          <div>
            <div className="flex justify-between mb-2 text-sm font-semibold text-white/80">
              <span>Cost</span>
              <span>₹0 – ₹1499+</span>
            </div>
            <input type="range" min="0" max="1500" className="w-full accent-pink-500" />
          </div>
          <FilterGroup title="Availability" items={["In Stock", "Out of Stock"]} check />
          <ColorFilter />
        </div>
      )}

      {/* Content */}
      <main className="flex-grow px-6 py-8 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Men’s Collection</h1>

        {/* 3 columns x 8 rows = 24 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((p) => {
            const mrp = p.price * 2; // dynamic cut MRP (double displayed)
            return (
              <div
                key={p.idx}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4"
              >
                <div className="aspect-[4/5] mb-3 overflow-hidden rounded-xl bg-black/10">
                  <img
                    src={getImg(p.image)}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="text-xs text-white/60">
                      {p.stock ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-white/50 line-through">₹{mrp}</span>
                      <span className="text-sm font-semibold">₹{p.price}</span>
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openModal(p)}
                    className="flex-1 rounded-full px-3 py-2 text-sm font-semibold border border-white/15 bg-white/10 hover:bg-white/20 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => addToCartQuick(p)}
                    className="flex-1 rounded-full px-3 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
         {/* Sponsored banner (300×250) */}
<AdSlot width={300} height={250} title="Sponsored" />

        {/* Pagination 1..5 */}
        <div className="flex justify-center mt-10 gap-2">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
            const isActive = page === i;
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={
                  "h-9 w-9 rounded-full grid place-items-center text-sm font-semibold border transition " +
                  (isActive
                    ? "bg-gradient-to-br from-pink-500 to-purple-500 border-transparent"
                    : "bg-white/10 border-white/10 hover:bg-white/20")
                }
                aria-label={`Page ${i + 1}`}
                title={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10 bg-white/5 backdrop-blur-xl text-sm text-white/70">
        <div className="max-w-7xl mx-auto flex justify-between">
          <div>© {new Date().getFullYear()} FlexDrip India. All rights reserved.</div>
          <div className="space-x-4">
            <a href="#" className="hover:text-pink-400">Privacy</a>
            <a href="#" className="hover:text-pink-400">Terms</a>
            <a href="#" className="hover:text-pink-400">Support</a>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {open && active && (
        <ProductModal
          item={active}
          activeImg={activeImg}
          onClose={() => setOpen(false)}
          onPickImg={(src) => setActiveImg(src)}
          onAddToCart={(size, color) => {
            if (!size || !color) return alert("Please select size and colour.");
            const id = `${active.image}-${size}-${color}`;
            cart.add(
              {
                id,
                title: `${active.title} (${size}, ${color})`,
                price: active.price,
                image: active.image,
              },
              1
            );
            setOpen(false);
          }}
          onBuyNow={(size, color) => {
            if (!size || !color) return alert("Please select size and colour.");
            // go to /buy with just this item
            nav("/buy", {
              state: {
                buyOne: {
                  id: `${active.image}-${size}-${color}`,
                  title: `${active.title} (${size}, ${color})`,
                  price: active.price,
                  image: active.image,
                  qty: 1,
                },
              },
            });
          }}
        />
      )}
    </div>
  );
}

/* ---------- Helpers & Subcomponents ---------- */

// Build a gallery: tries base, base with b/c suffixes if they exist
function buildGallery(baseFile: string): string[] {
  const [name, ext] = baseFile.split(".");
  const candidates = [baseFile, `${name}b.${ext}`, `${name}c.${ext}`];
  const urls = candidates.map((f) => getImg(f)).filter(Boolean) as string[];
  return urls.length ? urls : [getImg(baseFile)!];
}

function ProductModal({
  item,
  activeImg,
  onClose,
  onPickImg,
  onAddToCart,
  onBuyNow,
}: {
  item: Item;
  activeImg?: string;
  onClose: () => void;
  onPickImg: (src: string) => void;
  onAddToCart: (size: string | null, color: string | null) => void;
  onBuyNow: (size: string | null, color: string | null) => void;
}) {
  const gallery = buildGallery(item.image);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL", "7XL"];
  const colors = [
    "black",
    "white",
    "gray",
    "royalblue",
    "seagreen",
    "red",
    "orange",
    "pink",
    "purple",
  ];
  const mrp = item.price * 2;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="absolute inset-0 flex justify-center items-start overflow-y-auto p-6">
        <div className="w-full max-w-6xl bg-[#111318] text-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header row */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <div className="text-lg font-semibold">{item.title}</div>
            <button
              onClick={onClose}
              className="rounded-full px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/15"
            >
              Close
            </button>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left: gallery */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => onPickImg(src)}
                    className="h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-black/10 hover:border-pink-500/60"
                  >
                    <img src={src} alt={`preview ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex-1 rounded-xl overflow-hidden border border-white/10 bg-black/10 min-h-[420px] grid place-items-center">
                <img src={activeImg ?? gallery[0]} alt={item.title} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Right: details */}
            <div className="space-y-5">
              <div>
                <div className="text-2xl font-bold">{item.title}</div>
                <div className="text-white/70 mt-1">
                  Premium combed cotton. Ultra-soft handfeel. Printed on demand.
                  Built for all-day comfort and a flattering drape.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold">₹{item.price}</div>
                <div className="text-white/60 line-through">₹{mrp}</div>
              </div>

              {/* Sizes */}
              <div>
                <div className="text-sm font-semibold mb-2">Size</div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={
                        "px-3 py-1.5 rounded-full text-sm border " +
                        (size === s
                          ? "bg-pink-500 border-pink-500"
                          : "bg-white/10 border-white/15 hover:bg-white/20")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="text-sm font-semibold mb-2">Color</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {colors.map((c) => (
                    <button
                      key={c}
                      title={c}
                      onClick={() => setColor(c)}
                      className={
                        "h-7 w-7 rounded-full border " +
                        (color === c
                          ? "ring-2 ring-pink-500 border-pink-500"
                          : "border-white/20 hover:scale-110 transition")
                      }
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {color && <span className="text-xs ml-2 text-white/70">{color}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => onBuyNow(size, color)}
                  className="flex-1 rounded-full px-4 py-3 font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"
                >
                  Buy now
                </button>
                <button
                  onClick={() => onAddToCart(size, color)}
                  className="flex-1 rounded-full px-4 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/20"
                >
                  Add to cart
                </button>
              </div>

              {/* Policies */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <PolicyCard title="Terms & Conditions">
                  By placing an order you accept FlexDrip India’s standard T&C.
                </PolicyCard>
                <PolicyCard title="Delivery Policy">
                  Typically ships within 2–4 business days across India.
                </PolicyCard>
                <PolicyCard title="Return Policy">
                  7-day easy returns for unused items in original condition.
                </PolicyCard>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="px-6 pb-6">
            <div className="text-lg font-semibold mb-3">Customer reviews</div>
            <div className="space-y-3">
              {[
                { name: "Ravi P.", text: "Quality is fantastic. Fits true to size!" },
                { name: "Aisha K.", text: "Print looks premium and the fabric is comfy." },
                { name: "Manoj S.", text: "Great value at this price point." },
              ].map((r, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 bg-white/10 shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        r.name
                      )}`}
                      alt={r.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{r.name}</div>
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                    <div className="text-white/80">{r.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-white/70">{children}</div>
    </div>
  );
}

function FilterGroup({
  title,
  items,
  check = false,
}: {
  title: string;
  items: string[];
  check?: boolean;
}) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2 text-white/80 flex items-center justify-between">
        {title} <ChevronDown className="h-3 w-3 opacity-70" />
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <label
            key={t}
            className={
              check
                ? "flex items-center gap-1 text-xs"
                : "text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
            }
          >
            {check && <input type="checkbox" className="accent-pink-500" />}
            {t}
          </label>
        ))}
      </div>
    </div>
  );
}

function ColorFilter() {
  const colors = [
    "royalblue",
    "deepskyblue",
    "pink",
    "yellow",
    "orange",
    "seagreen",
    "red",
    "black",
    "gray",
    "white",
    "purple",
    "teal",
    "gold",
    "limegreen",
    "brown",
  ];
  return (
    <div>
      <div className="text-sm font-semibold mb-2 text-white/80">Color</div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <div
            key={c}
            title={c}
            className="h-6 w-6 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}
