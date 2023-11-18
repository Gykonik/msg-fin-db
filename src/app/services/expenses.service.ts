import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Expense} from "../types";
import {HttpParams} from "@angular/common/http";
import {FilterMetadata} from "primeng/api/filtermetadata";
import {FilterMatchMode} from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private readonly EXPENSE_ENDPOINT: string = "transactions";

    constructor(private dataService: DataService) {
    }

    getExpenses(page: number, size: number, sortField: string, sortOrder: string, filters?: {
        [s: string]: FilterMetadata | FilterMetadata[] | undefined;
    }): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', `${sortField},${sortOrder}`);

        Object.keys(filters || {}).forEach(key => {
            const filterValue = filters![key];
            if (Array.isArray(filterValue)) {
                filterValue.forEach(filter => {
                    if (filter.value !== null && filter.value !== undefined) {
                        params = this.appendFilterParam(params, key, filter);
                    }
                });
            } else if (filterValue) {
                if (filterValue.value !== null && filterValue.value !== undefined) {
                    params = this.appendFilterParam(params, key, filterValue);
                }
            }
        });

        return this.dataService.getData(this.EXPENSE_ENDPOINT + "/getTransactionsPaginated", params);
    }


    private appendFilterParam(params: HttpParams, key: string, filter: FilterMetadata): HttpParams {
        let serializedValue = '';
        switch (filter.matchMode) {
            case FilterMatchMode.STARTS_WITH:
            case FilterMatchMode.CONTAINS:
            case FilterMatchMode.NOT_CONTAINS:
            case FilterMatchMode.ENDS_WITH:
            case FilterMatchMode.EQUALS:
            case FilterMatchMode.NOT_EQUALS:
                // Text-based filters
                serializedValue = filter.value;
                break;
            case FilterMatchMode.LESS_THAN:
            case FilterMatchMode.LESS_THAN_OR_EQUAL_TO:
            case FilterMatchMode.GREATER_THAN:
            case FilterMatchMode.GREATER_THAN_OR_EQUAL_TO:
            case FilterMatchMode.BETWEEN:
                // Numeric filters
                serializedValue = filter.value.toString();
                break;
            case FilterMatchMode.DATE_IS:
            case FilterMatchMode.DATE_IS_NOT:
            case FilterMatchMode.DATE_BEFORE:
            case FilterMatchMode.DATE_AFTER:
                // Date filters
                serializedValue = filter.value instanceof Date ? filter.value.toISOString() : filter.value;
                break;
        }
        return params.append(`filter_${key}_${filter.matchMode}`, serializedValue);
    }


    addExpense(expense: Expense): Observable<boolean> {
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
