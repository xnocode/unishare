"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Eye, LayoutGrid, Search } from "lucide-react";
import { PAGES, CATEGORY_ORDER, type UniSharePage } from "@/data/pages";
import { UniShareLogo } from "@/components/unishare/logo";
import { PageViewer } from "@/components/unishare/page-viewer";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [visits, setVisits] = useState<number | null>(null);

  // register a visit via the backend on mount
  useEffect(() => {
    fetch("/api/visits", { method: "POST" })
      .then((r) => r.json())
      .then((d: { visits?: number }) => setVisits(d.visits ?? null))
      .catch(() => {});
  }, []);

  // deep link support: ?page=slug (initial URL read happens once on mount)
  useEffect(() => {
    const readSlug = () => {
      const slug = new URLSearchParams(window.location.search).get("page");
      return slug && PAGES.some((p) => p.slug === slug) ? slug : null;
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore of a shared ?page= deep link
    setSelectedSlug(readSlug());
    const onPop = () => setSelectedSlug(readSlug());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openPage = (page: UniSharePage) => {
    setSelectedSlug(page.slug);
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.slug);
    window.history.pushState({}, "", url);
  };

  const closeViewer = () => {
    setSelectedSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.pushState({}, "", url);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PAGES.filter((p) => {
      const inCategory = category === "All" || p.category === category;
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.includes(q.replace(/\s+/g, "-"));
      return inCategory && inQuery;
    });
  }, [query, category]);

  const selected = selectedSlug
    ? PAGES.find((p) => p.slug === selectedSlug) ?? null
    : null;

  const tabs = ["All", ...CATEGORY_ORDER];
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: PAGES.length };
    for (const p of PAGES) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#171c1b]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-[1.5px] border-[#111] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="text-[#0f6b63]">
              <UniShareLogo size={30} />
            </span>
            <div className="leading-tight">
              <p className="text-[18px] font-bold">UniShare</p>
              <p className="hidden text-[11px] text-[#4b5552] sm:block">
                Campus sharing platform · full design system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border-[1.5px] border-[#111] px-3 py-1.5 text-[12px] font-medium md:flex">
              <LayoutGrid className="h-3.5 w-3.5 text-[#0f6b63]" aria-hidden="true" />
              {PAGES.length} screens
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border-[1.5px] border-[#111] px-3 py-1.5 text-[12px] font-medium sm:flex">
              <Eye className="h-3.5 w-3.5 text-[#0f6b63]" aria-hidden="true" />
              {visits === null ? "—" : visits} visits
            </div>
            <a
              href="#screens"
              className="rounded-md border-[1.5px] border-[#0f6b63] bg-[#0f6b63] px-4 py-2 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f6b63]"
            >
              Browse screens
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {/* Hero */}
        <section className="pb-10 pt-12 sm:pb-14 sm:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="mb-3 inline-block rounded-full border-[1.5px] border-[#111] bg-[#e4ebe8] px-3 py-1 text-[12px] font-medium text-[#0f6b63]">
              Complete multi-page website · {CATEGORY_ORDER.length} sections
            </p>
            <h1 className="text-[34px] font-bold leading-[1.12] tracking-tight sm:text-[46px]">
              Everything students share,
              <br />
              <span className="text-[#0f6b63]">on one campus platform.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#4b5552] sm:text-[16px]">
              Browse the full UniShare experience — marketplace rentals, ride
              sharing, token wallet, safety SOS and admin tools. Every screen is
              live and interactive, exactly as designed.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-7 flex max-w-xl items-center gap-2 rounded-lg border-[1.5px] border-[#111] bg-white px-4 py-3 transition-shadow focus-within:shadow-[3px_3px_0_#0f6b63]"
          >
            <Search className="h-4.5 w-4.5 shrink-0 text-[#4b5552]" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search screens — try “marketplace”, “wallet”, “ride”…"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#8a948f]"
              aria-label="Search screens"
            />
          </motion.div>
        </section>

        {/* Category tabs */}
        <section id="screens" className="scroll-mt-20">
          <div className="sticky top-16 z-30 -mx-4 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const active = category === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setCategory(tab)}
                    className={`rounded-full border-[1.5px] px-3.5 py-1.5 text-[13px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f6b63] ${
                      active
                        ? "border-[#111] bg-[#0f6b63] text-white shadow-[2px_2px_0_#111]"
                        : "border-[#111] bg-white text-[#171c1b] hover:bg-[#e4ebe8]"
                    }`}
                    aria-pressed={active}
                  >
                    {tab}
                    <span className={`ml-1.5 text-[11px] ${active ? "text-[#cfe3df]" : "text-[#4b5552]"}`}>
                      {counts[tab] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 gap-4 pb-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((page, i) => (
                <motion.button
                  layout
                  key={page.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => openPage(page)}
                  className="group relative flex flex-col rounded-lg border-[1.5px] border-[#111] bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f6b63]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-[#e4ebe8] px-2.5 py-0.5 text-[11px] font-semibold text-[#0f6b63]">
                      {page.category}
                    </span>
                    <span className="text-[11px] font-medium tabular-nums text-[#8a948f]">
                      #{String(page.number).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-semibold leading-snug text-[#171c1b]">
                    {page.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#4b5552]">
                      Open screen
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border-[1.5px] border-[#0f6b63] bg-[#0f6b63] text-white transition-transform group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border-[1.5px] border-dashed border-[#111] py-16 text-center">
              <p className="text-[15px] font-semibold">No screens found</p>
              <p className="text-[13px] text-[#4b5552]">
                Try a different search or pick another category.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t-[1.5px] border-[#111] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#4b5552]">
            <span className="text-[#0f6b63]">
              <UniShareLogo size={20} />
            </span>
            UniShare · {PAGES.length} screens · {CATEGORY_ORDER.length} sections
          </div>
          <p className="text-[12px] text-[#4b5552]">
            Next.js · TypeScript · Prisma · Framer Motion
          </p>
        </div>
      </footer>

      {/* Viewer overlay */}
      <AnimatePresence>
        {selected && (
          <PageViewer
            pages={PAGES}
            current={selected}
            onClose={closeViewer}
            onNavigate={(p) => {
              setSelectedSlug(p.slug);
              const url = new URL(window.location.href);
              url.searchParams.set("page", p.slug);
              window.history.replaceState({}, "", url);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
