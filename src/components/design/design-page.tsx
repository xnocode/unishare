import type { DesignContent } from "@/lib/design-content";
import { PageScripts } from "./page-scripts";
import { DesignLinkHandler } from "./design-link-handler";
import { AuthFlowHandler } from "./auth-flow-handler";

/**
 * Renders one of the 85 original UniShare design pages inside the Next.js app.
 * The design is preserved byte-for-byte: the original CSS is injected as-is and
 * the original body HTML is rendered without modification (links are the only
 * thing rewritten — they now point at real routes).
 */
export function DesignPage({ content }: { content: DesignContent }) {
  return (
    <>
      {content.fonts.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {/* Unlayered CSS: overrides Tailwind preflight, exactly like the source file */}
      <style dangerouslySetInnerHTML={{ __html: content.css }} />
      <div
        className="unishare-design-root"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
      <DesignLinkHandler />
      <AuthFlowHandler />
      {content.scripts.length > 0 ? <PageScripts codes={content.scripts} /> : null}
    </>
  );
}
