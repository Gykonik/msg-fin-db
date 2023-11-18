import {Injectable} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ACCESS_RIGHTS, Expense, UserData} from "../types";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedInUser: UserData | undefined;

  // TODO: Later set it to false by default
  private isAuthenticated: boolean = true;

  // TODO: Later set it to NONE by default
  private rights: ACCESS_RIGHTS = ACCESS_RIGHTS.ADMIN

  public isAdmin(): boolean{
    return this.isLoggedIn() && this.rights === ACCESS_RIGHTS.ADMIN
  }

  public isUser(): boolean{
    return this.isLoggedIn() && (this.rights === ACCESS_RIGHTS.USER || this.rights === ACCESS_RIGHTS.ADMIN);
  }

  constructor(private dataService: DataService) {
  }

  login(username: string, password: string): Observable<boolean> {
    console.log("LOGIN WITH: ", { username, password})

    // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
    return this.dataService.postData('/login', {username, password}).pipe(
      map((response): boolean => {
        // TODO: Somehow set the loggedInUser and rights
        localStorage.setItem('auth_token', response.token);
        this.isAuthenticated = true;
        return true; // Indicate successful login
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(error); // Forward the error
      })
    );
  }

  signup(user: UserData): Observable<boolean> {
    // TODO: REPLACE ENDPOINT WITH REAL REGISTER ENDPOINT
    console.log("SIGNUP WITH: ", user)
    return this.dataService.postData('/register', user).pipe(
      map((response): boolean => {
        return true; // Indicate successful registration
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(error); // Forward the error
      })
    );
  }


  updateUser(user: UserData): Observable<boolean> {
    // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
    return this.dataService.postData('/updateUser', user).pipe(
      map((): boolean => {
        return true;
      }),
      catchError((error) => {
        return throwError(error); // Forward the error
      })
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.dataService.deleteData('/user').pipe(
      map((): boolean => {
        return true; // Indicate successful login
      }),
      catchError((error) => {
        return throwError(error); // Forward the error
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
