"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import type { UniSharePage } from "@/data/pages";

interface PageViewerProps {
  pages: UniSharePage[];
  current: UniSharePage;
  onClose: () => void;
  onNavigate: (page: UniSharePage) => void;
}

export function PageViewer({ pages, current, onClose, onNavigate }: PageViewerProps) {
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const loading = loadedSlug !== current.slug;
  const index = pages.findIndex((p) => p.slug === current.slug);
  const trackedRef = useRef<Set<string>>(new Set());

  const goPrev = useCallback(() => {
    if (index > 0) onNavigate(pages[index - 1]);
  }, [index, pages, onNavigate]);

  const goNext = useCallback(() => {
    if (index < pages.length - 1) onNavigate(pages[index + 1]);
  }, [index, pages, onNavigate]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  // lock body scroll while viewer open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // record view via backend
  useEffect(() => {
    if (trackedRef.current.has(current.slug)) return;
    trackedRef.current.add(current.slug);
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: current.slug }),
    }).catch(() => {});
  }, [current.slug]);

  // reset loading state on navigation
  const handleLoad = useCallback(() => {
    setLoadedSlug(current.slug);
  }, [current.slug]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="dialog"
      aria-label={`Previewing ${current.title}`}
    >
      <header className="flex h-14 shrink-0 items-center gap-2 border-b-[1.5px] border-[#111] bg-white px-3 sm:px-4">
        <button
          onClick={onClose}
          className="flex h-9 items-center gap-1.5 rounded-md border-[1.5px] border-[#111] bg-white px-3 text-[13px] font-medium text-[#171c1b] transition-colors hover:bg-[#e4ebe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f6b63]"
          aria-label="Back to all screens"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">All screens</span>
        </button>

        <div className="mx-1 min-w-0 flex-1 text-center sm:mx-2">
          <p className="truncate text-[14px] font-bold leading-tight text-[#171c1b]">
            {current.title}
          </p>
          <p className="text-[11px] leading-tight text-[#4b5552]">
            {current.category} · {index + 1} of {pages.length}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="flex h-9 w-9 items-center justify-center rounded-md border-[1.5px] border-[#111] bg-white text-[#171c1b] transition-colors hover:bg-[#e4ebe8] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous screen"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={goNext}
            disabled={index === pages.length - 1}
            className="flex h-9 w-9 items-center justify-center rounded-md border-[1.5px] border-[#111] bg-white text-[#171c1b] transition-colors hover:bg-[#e4ebe8] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next screen"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href={current.slug === "home" ? "/" : `/${current.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-md border-[1.5px] border-[#111] bg-white px-3 text-[13px] font-medium text-[#171c1b] transition-colors hover:bg-[#e4ebe8] sm:flex"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open
          </a>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md border-[1.5px] border-[#111] bg-white text-[#171c1b] transition-colors hover:bg-[#e4ebe8]"
            aria-label="Close viewer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="relative flex-1 bg-[#eef2f0]">
        <AnimatePresence>
          {loading && (
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center bg-[#eef2f0]"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#0f6b63] border-t-transparent"
                  role="status"
                  aria-label="Loading screen"
                />
                <p className="text-[13px] font-medium text-[#4b5552]">
                  Loading {current.title}…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <iframe
          key={current.slug}
          src={current.slug === "home" ? "/" : `/${current.slug}`}
          title={`UniShare · ${current.title}`}
          className="h-full w-full border-0 bg-white"
          onLoad={handleLoad}
        />
      </div>
    </motion.div>
  );
}
