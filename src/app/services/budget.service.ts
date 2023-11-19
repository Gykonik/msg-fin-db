import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {BudgetPlanEntry} from "../types";
import {AuthenticationService} from "./authentication.service";


@Injectable({
    providedIn: 'root'
})
@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private readonly BUDGET_ENDPOINT: string = "budget";

    constructor(private dataService: DataService, private authService: AuthenticationService) {
    }

    getBudgetBarChart(): Observable<any> {
        const endpoint: string = `${this.BUDGET_ENDPOINT}/budgetChartData/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint);
    }

    getBudgets(): Observable<any> {
        const endpoint: string = `${this.BUDGET_ENDPOINT}/list/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint);
    }

    addBudget(budget: BudgetPlanEntry): Observable<any> {
        const endpoint: string = `${this.BUDGET_ENDPOINT}/create/${this.authService.getUserId()}`;
        return this.dataService.postData(endpoint, budget).pipe(
            map(response => response),
            catchError((error) => throwError(error))
        );
    }

    updateBudget(budget: BudgetPlanEntry): Observable<any> {
        const endpoint: string = `${this.BUDGET_ENDPOINT}/update/${this.authService.getUserId()}/${budget.id}`;
        return this.dataService.updateData(endpoint, budget).pipe(
            map(response => response),
            catchError((error) => throwError(error))
        );
    }

    deleteBudget(budget: BudgetPlanEntry): Observable<any> {
        const endpoint: string = `${this.BUDGET_ENDPOINT}/delete/${this.authService.getUserId()}/${budget.id}`;
        return this.dataService.deleteData(endpoint).pipe(
            map(response => response),
            catchError((error) => throwError(error))
        );
    }

    deleteMultipleBudgets(expenses: BudgetPlanEntry[]): Observable<any> {
        const ids = expenses.map((e: BudgetPlanEntry) => e.id);
        const endpoint = `${this.BUDGET_ENDPOINT}/deleteMultipleBudgets/${this.authService.getUserId()}`;
        return this.dataService.deleteData(endpoint, ids).pipe(
            map((): boolean => true),
            catchError((error) => throwError(error))
        );
    }

}

