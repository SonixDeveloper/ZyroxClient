/* Downloads are ordinary links so the page also works without JavaScript. */
'use strict';
(async () => {
  try {
    const response = await fetch('release.json', { cache: 'no-cache' });
    if (!response.ok) return;
    const release = await response.json();
    const base = 'https://github.com/SonixDeveloper/ZyroxClient/releases/download/';
    for (const asset of release.assets) {
      const url = new URL(asset.url);
      if (!url.href.startsWith(base)) continue;
      for (const link of document.querySelectorAll(`[data-asset="${asset.id}"]`)) link.href = url.href;
      for (const label of document.querySelectorAll(`[data-size="${asset.id}"]`)) {
        label.textContent = `${(asset.bytes / 1024 / 1024).toFixed(1)} MB`;
      }
    }
  } catch {
    // Static links remain usable when metadata is unavailable.
  }
})();
