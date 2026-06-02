import { HttpInterceptorFn } from '@angular/common/http';

const apiHosts = ['digital.supersoftbd.com', 'mec.supersoftbd.com'];
const proxiedApiPrefixes = ['/HWS', '/apiA'];

export const apiCacheBustInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  if (proxiedApiPrefixes.some(prefix => req.url === prefix || req.url.startsWith(`${prefix}/`))) {
    return next(req.clone({
      params: req.params.set('_ts', Date.now().toString())
    }));
  }

  let requestUrl: URL;
  try {
    requestUrl = new URL(req.url);
  } catch {
    return next(req);
  }

  if (!apiHosts.includes(requestUrl.hostname)) {
    return next(req);
  }

  return next(req.clone({
    params: req.params.set('_ts', Date.now().toString())
  }));
};
