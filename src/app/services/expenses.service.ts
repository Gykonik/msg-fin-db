import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ACCESS_RIGHTS, Expense} from "../types";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private dataService: DataService) {}

  getExpenses(): Observable<Expense[]> {
    console.log("GET EXPENSE")
    return this.dataService.getData("/expenses");
  }

  addExpense(expense: Expense): Observable<boolean> {
    console.log("ADD EXPENSE: ", expense)

    // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
    return this.dataService.postData('/expenses', expense).pipe(
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
    return this.dataService.postData('/expenses', expense).pipe(
      map((): boolean => {
        return true; // Indicate successful login
      }),
      catchError((error) => {
        return throwError(error); // Forward the error
      })
    );
  }


  deleteMultipleExpenses(expenses: Expense[]): Observable<any> {
    return this.dataService.deleteData('/expenses').pipe(
      map((): boolean => {
        return true; // Indicate successful login
      }),
      catchError((error) => {
        return throwError(error); // Forward the error
      })
    );
  }

  deleteExpense(expense: Expense): Observable<any> {
    return this.dataService.deleteData('/expenses').pipe(
      map((): boolean => {
        return true; // Indicate successful login
      }),
      catchError((error) => {
        return throwError(error); // Forward the error
      })
    );
  }
}
