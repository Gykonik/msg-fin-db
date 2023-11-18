import {bootstrapApplication} from "@angular/platform-browser";
import {provideRouter, Routes} from "@angular/router";
import {AppComponent} from "./app/app.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {DashboardComponent} from "./app/dashboard/dashboard.component";
import {BudgetPlanningComponent} from "./app/budget-planning/budget-planning.component";
import {ExpensesComponent} from "./app/expenses/expenses.component";
import {AccountsComponent} from "./app/accounts/accounts.component";
import {LoginComponent} from "./app/login/login.component";
import {authGuard} from "./app/guards/auth.guard";
import {HomeComponent} from "./app/home/home.component";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canMatch: [authGuard]},
  { path: 'budget-planning', component: BudgetPlanningComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: '/home' } // wildcard for unmatched routes
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
    MessageService,
    ConfirmationService,
  ],
}).catch((error) => console.error(error));
