import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Expense} from "../types";
import {HttpParams} from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private readonly EXPENSE_ENDPOINT: string = "transactions";

    constructor(private dataService: DataService) {
    }

    getExpenses(page: number, size: number, sortField: string, sortOrder: string): Observable<any> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', `${sortField},${sortOrder}`);
        console.log("Params: ", params);
        return this.dataService.getData(this.EXPENSE_ENDPOINT + "/getAllTransactions", params);
    }

    addExpense(expense: Expense): Observable<boolean> {
        console.log("ADD EXPENSE: ", expense)

        // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
        return this.dataService.postData(this.EXPENSE_ENDPOINT + "/createTransaction", expense).pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }

    updateExpense(expense: Expense): Observable<boolean> {
        // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
        return this.dataService.postData(this.EXPENSE_ENDPOINT + "/updateTransaction/" + expense.id, expense).pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }


    deleteMultipleExpenses(expenses: Expense[]): Observable<any> {
        return this.dataService.deleteData(this.EXPENSE_ENDPOINT + "/deleteMultipleTransactions", expenses.map((e: Expense) => e.id)).pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }

    deleteExpense(expense: Expense): Observable<any> {
        return this.dataService.deleteData(this.EXPENSE_ENDPOINT + "/deleteTransaction/" + expense.id).pipe(
            map((): boolean => {
                return true; // Indicate successful login
            }),
            catchError((error) => {
                return throwError(error); // Forward the error
            })
        );
    }
}
