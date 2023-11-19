import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {inject} from "@angular/core";

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const authService: AuthenticationService = inject(AuthenticationService);
  const router: Router = inject(Router);

  if (!authService.isAdmin()) {
    router.navigate(['']);
    return false;
  }
  return true;
};


