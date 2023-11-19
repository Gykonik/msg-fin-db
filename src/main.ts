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
import {LoginComponent} from "./app/login/login.component";
import {authGuard} from "./app/guards/auth.guard";
import {HomeComponent} from "./app/home/home.component";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {DataService} from "./app/services/data.service";
import {adminGuard} from "./app/guards/admin.guard";
import {UserManagementComponent} from "./app/user-management/user-management.component";

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canMatch: [authGuard]},
    {path: 'budget-planning', component: BudgetPlanningComponent, canMatch: [authGuard]},
    {path: 'expenses', component: ExpensesComponent, canMatch: [authGuard]},
    {path: 'manage-users', component: UserManagementComponent, canMatch: [adminGuard]},
    {path: '', redirectTo: '/home', pathMatch: 'full'}, // default route
    {path: '**', redirectTo: '/home'} // wildcard for unmatched routes
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
        DataService
    ],
}).catch((error) => console.error(error));
