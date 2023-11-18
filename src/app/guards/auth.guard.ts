import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService: AuthenticationService = inject(AuthenticationService);
  const router: Router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['login']);
    return false;
  }
  return true;
};


