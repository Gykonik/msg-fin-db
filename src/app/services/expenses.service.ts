import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Expense} from "../types";
import {HttpParams} from "@angular/common/http";
import {FilterMetadata} from "primeng/api/filtermetadata";
import {FilterMatchMode} from "primeng/api";
import {AuthenticationService} from "./authentication.service";


@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private readonly EXPENSE_ENDPOINT: string = "transactions";

    constructor(private dataService: DataService, private authService: AuthenticationService) {
    }

    getExpenses(page: number, size: number, sortField: string, sortOrder: string, filters?: {
        [s: string]: FilterMetadata | FilterMetadata[] | undefined;
    }): Observable<any> {
        let params: HttpParams = new HttpParams()
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

        const endpoint: string = `${this.EXPENSE_ENDPOINT}/getTransactionsPaginated/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint, params);
    }

    getAllExpenses(): Observable<any> {
        const endpoint: string = `${this.EXPENSE_ENDPOINT}/getAllTransactions/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint);
    }

    getCandlestickChartData(): Observable<any> {
        const endpoint: string = `${this.EXPENSE_ENDPOINT}/candlestickChartData/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint);
    }

    getWeeklyScatterChart(): Observable<any> {
        const endpoint: string = `${this.EXPENSE_ENDPOINT}/weekScatterChart/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint);
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
        const endpoint = `${this.EXPENSE_ENDPOINT}/createTransaction/${this.authService.getUserId()}`;
        return this.dataService.postData(endpoint, expense).pipe(
            map((): boolean => true),
            catchError((error) => throwError(error))
        );
    }

    updateExpense(expense: Expense): Observable<boolean> {
        const endpoint = `${this.EXPENSE_ENDPOINT}/updateTransaction/${this.authService.getUserId()}/${expense.id}`;
        return this.dataService.updateData(endpoint, expense).pipe(
            map((): boolean => true),
            catchError((error) => throwError(error))
        );
    }


    deleteMultipleExpenses(expenses: Expense[]): Observable<any> {
        const ids = expenses.map((e: Expense) => e.id);
        const endpoint = `${this.EXPENSE_ENDPOINT}/deleteMultipleTransactions/${this.authService.getUserId()}`;
        return this.dataService.deleteData(endpoint, ids).pipe(
            map((): boolean => true),
            catchError((error) => throwError(error))
        );
    }

    deleteExpense(expense: Expense): Observable<any> {
        const endpoint = `${this.EXPENSE_ENDPOINT}/deleteTransaction/${this.authService.getUserId()}/${expense.id}`;
        return this.dataService.deleteData(endpoint).pipe(
            map((): boolean => true),
            catchError((error) => throwError(error))
        );
    }

    getSumOfTransactions(): Observable<any> {
        const endpoint = `${this.EXPENSE_ENDPOINT}/sumTransactions/${this.authService.getUserId()}`;
        return this.dataService.getData(endpoint).pipe(
            map(response => response),
            catchError((error) => throwError(error))
        );
    }
}
