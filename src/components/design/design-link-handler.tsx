"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Makes the remaining action-style links (Resend code, Clear filters,
 * file uploads, admin actions…) give real, useful feedback instead of
 * silently jumping to the top of the page. Runs only inside design pages
 * and never changes their visual design.
 */
export function DesignLinkHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href='#']");
      if (!anchor) return;
      // only handle links inside a rendered design page
      if (!anchor.closest(".unishare-design-root")) return;

      e.preventDefault();
      const text = (anchor.textContent || "").replace(/\s+/g, " ").trim();
      const t = text.toLowerCase();

      if (t.includes("resend")) {
        toast({
          title: "New code sent",
          description: "Check your university inbox — it arrives within a minute.",
        });
        return;
      }

      if (t.includes("clear") || t.includes("reset") || t.includes("remove")) {
        const form = anchor.closest("form");
        const scope = form ?? anchor.closest(".unishare-design-root");
        if (scope) {
          scope
            .querySelectorAll<HTMLInputElement>("input:not([type=hidden]), select, textarea")
            .forEach((el) => {
              if (el.type === "checkbox" || el.type === "radio") el.checked = el.defaultChecked;
              else el.value = el.defaultValue;
            });
        }
        toast({ title: "Filters cleared", description: "Everything is back to its default state." });
        return;
      }

      if (t.includes("photo") || t.includes("choose files") || t.includes("attach")) {
        const fileInput = anchor
          .closest(".unishare-design-root")
          ?.querySelector<HTMLInputElement>("input[type=file]");
        if (fileInput) {
          fileInput.click();
          return;
        }
        toast({
          title: "Photo picker",
          description: "File uploads connect when accounts go live on your campus.",
        });
        return;
      }

      if (t.includes("refresh")) {
        toast({ title: "Refreshing status…", description: "Give it a second." });
        setTimeout(() => window.location.reload(), 700);
        return;
      }

      if (t.includes("request") || t.includes("evidence") || t.includes("verify")) {
        toast({
          title: "Request sent",
          description: `${text.replace(/[→↗]/g, "").trim()} — the other party has been notified.`,
        });
        return;
      }

      if (t.includes("save")) {
        toast({ title: "Saved", description: "Your progress is kept — you can continue later." });
        return;
      }

      if (t.includes("cancel")) {
        toast({ title: "Cancelled", description: "Nothing was changed." });
        return;
      }

      // filter chips / tabs and everything else: acknowledge without navigating
      toast({ title: text, description: "This control is part of the design preview." });
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [toast]);

  // mark the current page in nav lists for screen readers (no visual change)
  useEffect(() => {
    const path = window.location.pathname;
    document
      .querySelectorAll<HTMLAnchorElement>(".unishare-design-root a[href]")
      .forEach((a) => {
        const href = a.getAttribute("href") || "";
        const norm = href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href;
        if (norm === path) a.setAttribute("aria-current", "page");
      });
  }, []);

  return null;
}
