import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {BudgetPlanEntry} from "../types";


@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    constructor(private dataService: DataService) {
    }

    getBudgets(): Observable<BudgetPlanEntry[]> {
        console.log("GET BUDGETS")
        return this.dataService.getData("/budgets");
    }

    addBudget(budget: BudgetPlanEntry): Observable<boolean> {
        console.log("ADD BUDGET: ", budget)

        // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
        return this.dataService.postData('/budgets', budget).pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }

    updateBudget(budget: BudgetPlanEntry): Observable<boolean> {
        // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
        return this.dataService.postData('/budgets', budget).pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }


    deleteMultipleBudgets(budgets: BudgetPlanEntry[]): Observable<any> {
        return this.dataService.deleteData('/budgets').pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }

    deleteBudget(budget: BudgetPlanEntry): Observable<any> {
        return this.dataService.deleteData('/budgets').pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }
}
