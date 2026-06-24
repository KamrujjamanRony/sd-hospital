import { Injectable, NgZone, OnDestroy } from '@angular/core';

/**
 * A real Ctrl+F5 (bypassing the HTTP cache) cannot be triggered from JS, so we
 * emulate it: purge the Cache Storage and unregister any service worker, then
 * reload. That forces the browser to refetch index.html and its current,
 * freshly-hashed chunks instead of replaying a stale cached shell.
 */
export async function hardReload(): Promise<void> {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }
  } catch {
    // Best-effort cache purge — reload regardless of whether it succeeded.
  } finally {
    location.reload();
  }
}

const DEPLOY_RELOAD_FLAG = 'app:deploy-reload';

/**
 * Watches the deployed `index.html` for a new build and hard-reloads the tab
 * when one appears — so EVERY open browser refreshes itself within one poll
 * interval of a redeploy, not just the ones that happen to navigate afterwards.
 *
 * How it detects a deploy: every production Angular build rewrites index.html
 * with new content-hashed asset filenames (e.g. `main-N6TK7TX5.js`). We fetch
 * index.html with `cache: 'no-store'`, extract the set of hashed `*.js` / `*.css`
 * filenames as a fingerprint, and compare it to the fingerprint captured when
 * this tab first loaded. A change means a new deploy is live → hard reload.
 *
 * No build-tooling, version.json, or service worker is required: the existing
 * hashed filenames ARE the version signal.
 */
@Injectable({ providedIn: 'root' })
export class DeployWatchService implements OnDestroy {
  /** How often to poll for a new build while the tab is visible (ms). */
  private readonly pollIntervalMs = 60_000;
  /** index.html resolved against <base href>, so it works under any deploy path. */
  private readonly indexUrl = new URL('index.html', document.baseURI).href;

  private baseline: string | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private reloading = false;

  private readonly onVisible = () => {
    if (document.visibilityState === 'visible') {
      void this.check();
    }
  };

  constructor(private readonly zone: NgZone) {}

  /**
   * Call once during bootstrap. Captures the current build's fingerprint, then
   * polls for changes. Runs outside Angular's change detection so the timer
   * never triggers needless work in this zoneless app.
   */
  start(): void {
    // If a previous deploy-reload already happened this session we still want to
    // re-baseline cleanly; clear any stale guard from the prior page load.
    sessionStorage.removeItem(DEPLOY_RELOAD_FLAG);

    void this.fetchFingerprint().then(fingerprint => {
      this.baseline = fingerprint;
    });

    this.zone.runOutsideAngular(() => {
      this.timerId = setInterval(() => void this.check(), this.pollIntervalMs);
    });
    document.addEventListener('visibilitychange', this.onVisible);
    window.addEventListener('online', this.onVisible);
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
    document.removeEventListener('visibilitychange', this.onVisible);
    window.removeEventListener('online', this.onVisible);
  }

  private async check(): Promise<void> {
    if (this.reloading || this.baseline === null || document.visibilityState !== 'visible') {
      return;
    }

    const current = await this.fetchFingerprint();
    // Network blip / server hiccup: skip this round, never reload on uncertainty.
    if (current === null || current === this.baseline) {
      return;
    }

    // Guard against a reload loop if, for any reason, the new fingerprint keeps
    // differing after we reload (e.g. a misbehaving CDN serving two versions).
    if (sessionStorage.getItem(DEPLOY_RELOAD_FLAG)) {
      this.baseline = current;
      return;
    }

    this.reloading = true;
    sessionStorage.setItem(DEPLOY_RELOAD_FLAG, '1');
    void hardReload();
  }

  /**
   * @returns the sorted, joined set of content-hashed JS/CSS filenames found in
   * index.html, or `null` if the document could not be fetched.
   */
  private async fetchFingerprint(): Promise<string | null> {
    try {
      const response = await fetch(this.indexUrl, { cache: 'no-store' });
      if (!response.ok) {
        return null;
      }
      const html = await response.text();
      // Angular/esbuild emits `<name>-<HASH>.<ext>` where HASH is 8 uppercase
      // base32 chars, e.g. `main-N6TK7TX5.js` / `styles-YFI2UB2J.css`.
      const hashedAssets = html.match(/[\w.-]+-[A-Z0-9]{8,}\.(?:js|css)\b/g) ?? [];
      // Fall back to the whole document if a build ever emits no hashed assets,
      // so we still notice *some* change rather than silently never reloading.
      return hashedAssets.length > 0 ? [...new Set(hashedAssets)].sort().join('|') : html;
    } catch {
      return null;
    }
  }
}
