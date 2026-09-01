// core/interceptors/credentials.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  let clonedReq = req.clone({ withCredentials: true });

  if (!/^(GET|HEAD)$/i.test(req.method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      clonedReq = clonedReq.clone({
        setHeaders: { 'X-XSRF-TOKEN': token },
      });
    }
  }

  return next(clonedReq);
};