/**
 * Project wordmark — the sage container mark plus the name, theme-aware, for
 * the docs nav and the landing header.
 *
 * Deliberately not public/icon0.svg: that file is an 824KB favicon-generator
 * export and has no business on a page load.
 */
export function Logo() {
  return (
    <span className="pa-mark" role="img" aria-label="pve-agents">
      <span className="pa-mark-glyph" aria-hidden="true" />
      pve-agents
    </span>
  );
}
