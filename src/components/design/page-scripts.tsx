"use client";

import { useEffect } from "react";

/**
 * Runs the original inline <script> blocks of a design page after hydration.
 * React deliberately does not execute scripts inside dangerouslySetInnerHTML,
 * so we re-create them here. Scripts are removed again on unmount.
 */
export function PageScripts({ codes }: { codes: string[] }) {
  useEffect(() => {
    const created = codes.map((code) => {
      const el = document.createElement("script");
      el.setAttribute("data-unishare-page-script", "");
      el.textContent = code;
      document.body.appendChild(el);
      return el;
    });
    return () => {
      for (const el of created) el.remove();
    };
  }, [codes]);

  return null;
}
