import { isPlatformBrowser } from '@angular/common';
import { inject, NgZone, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCookie } from '../shared/utils/decodeCookie';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const ngzone = inject(NgZone);

  const platform = inject(PLATFORM_ID);
  if (isPlatformBrowser(platform)) {
    const token = getCookie('token');
    if (token) {
      const tokenExpirationDate = getTokenExpirationDate(token);
      const isTokenExpired =
        tokenExpirationDate && tokenExpirationDate < new Date();

      if (!isTokenExpired) {
        return true; // Allow access to the route
      } else if (decodeToken(token).authstatus === 'partial') {
        ngzone.run(() => {
          router.navigate(['auth/complete-registration']);
        });

        return false;
      }
    }
    // Redirect to login page
    ngzone.run(() => {
      router.navigate(['/auth/login']);
    });
  }

  return false;
  function getTokenExpirationDate(token: string): Date | null {
    const tokenDecoded = decodeToken(token);

    if (tokenDecoded && tokenDecoded.exp) {
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(tokenDecoded.exp);
      return expirationDate;
    }

    return null;
  }

  function decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.log(error);
      localStorage.removeItem('token');
    }
  }
};
