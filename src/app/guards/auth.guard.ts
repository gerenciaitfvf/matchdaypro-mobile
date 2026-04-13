import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.hasValidToken()) {
    return true;
  } else {
    console.log('El token no es válido o ya expiró');
    router.navigateByUrl('login');
    return false;
  }
};
