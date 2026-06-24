import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withNavigationErrorHandler,
  type NavigationError,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { apiCacheBustInterceptor } from './services/api-cache-bust.interceptor';
import { DeployWatchService, hardReload } from './services/deploy-watch.service';

/**
 * After a redeploy the lazy-loaded chunk filenames change (new content hashes),
 * so a browser still running the previous build requests a chunk that no longer
 * exists and gets "Failed to fetch dynamically imported module". This catches
 * that specific navigation failure and does a one-time hard reload to pull the
 * fresh index.html. The sessionStorage flag prevents an infinite reload loop if
 * the failure turns out not to be deploy-related.
 *
 * This is the reactive safety net for tabs that navigate; DeployWatchService is
 * the proactive path that reloads idle tabs too.
 */
function handleChunkLoadError(navError: NavigationError): void {
  const message = String(navError.error?.message ?? navError.error ?? '');
  const isChunkLoadError =
    /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i.test(
      message,
    );

  if (!isChunkLoadError) {
    return;
  }

  const RELOAD_FLAG = 'app:chunk-reload';
  if (sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.removeItem(RELOAD_FLAG);
    return;
  }

  sessionStorage.setItem(RELOAD_FLAG, '1');
  void hardReload();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withNavigationErrorHandler(handleChunkLoadError)),
    provideHttpClient(withInterceptors([apiCacheBustInterceptor])),
    provideAppInitializer(() => inject(DeployWatchService).start()),
  ],
};
