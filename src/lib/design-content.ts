export interface DesignContent {
  /** route slug, e.g. "marketplace" */
  slug: string;
  /** page title from the original <title> tag */
  title: string;
  /** all <style> blocks from the original file */
  css: string;
  /** inner HTML of the original <body> (scripts stripped) */
  body: string;
  /** inline <script> contents, executed client-side after mount */
  scripts: string[];
  /** Google Fonts stylesheet URLs used by the page */
  fonts: string[];
}
