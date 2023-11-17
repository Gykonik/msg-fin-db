import {bootstrapApplication} from "@angular/platform-browser";
import {provideRouter, Routes} from "@angular/router";
import {AppComponent} from "./app/app.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {DashboardComponent} from "./app/dashboard-component/dashboard.component";
import {BudgetOverviewComponent} from "./app/budget-overview-component/budget-overview.component";
import {InvestmentPlannerComponent} from "./app/investment-planner-component/investment-planner.component";


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'budget-overview', component: BudgetOverviewComponent },
  { path: 'investment-planner', component: InvestmentPlannerComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: '/dashboard' } // wildcard for unmatched routes
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
