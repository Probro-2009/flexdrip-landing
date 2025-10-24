import { useMemo } from "react";

const ASSETS = import.meta.glob("/src/assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  as: "url",
});
function getImg(name: string) {
  const entry = Object.entries(ASSETS).find(([k]) => k.endsWith("/" + name));
  return entry ? (entry[1] as string) : undefined;
}

export default function Shop() {
  const items = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        title: `FlexDrip Tee #${i + 1}`,
        price: `₹${399 + (i % 5) * 100}`,
        image: `tshirt${(i % 8) + 1}.jpg`,
      })),
    []
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Shop All</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="mb-3 text-xs text-white/70 flex justify-between">
              <span>In stock</span>
              <span>{p.price}</span>
            </div>
            <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
              <img src={getImg(p.image)} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="text-sm font-semibold">{p.title}</div>
            <div className="text-xs text-white/60">100% combed cotton</div>
          </div>
        ))}
      </div>
    </div>
  );
}
