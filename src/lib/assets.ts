import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/content/site";

/** True when a file exists under /public. Checked at build time. */
export function publicFileExists(path: string | null | undefined): boolean {
  if (!path || /^https?:\/\//.test(path)) return Boolean(path);
  return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));
}

export const resumeAvailable = () => publicFileExists(site.resumePath);
export const photoAvailable = () => publicFileExists(site.photo);

export const resumeRequestHref = () =>
  `mailto:${site.email}?subject=${encodeURIComponent("Resume request")}&body=${encodeURIComponent(
    "Hi Vinayak,\n\nCould you send me your latest resume?\n\nThanks,",
  )}`;
