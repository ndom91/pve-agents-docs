import { appName } from "@/lib/shared";

/**
 * Project wordmark — the three-container mark plus the name. Used by the docs
 * nav and by the landing header and footer, so the two cannot drift.
 *
 * Deliberately not public/icon0.svg: despite the extension that file is a
 * single base64 raster in an <svg> wrapper, which is why it weighs 824KB.
 * icon1.png is the same mark at 96px and 7.6KB, which is over 4x the density
 * it is drawn at here.
 */
export function Logo() {
  return (
    <span className="pa-mark">
      <img
        className="pa-mark-glyph"
        src="/icon1.png"
        alt=""
        width={22}
        height={22}
        decoding="async"
      />
      {appName}
    </span>
  );
}
