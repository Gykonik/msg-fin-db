import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {DataService} from "./data.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ACCESS_RIGHTS, UserData} from "../types";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private loggedInUserSignal: WritableSignal<UserData | null> = signal({
        id: 123,
        firstname: "Niklas",
        surname: "Büchel",
        email: "abc@test.com",
        rights: ACCESS_RIGHTS.ADMIN // Optional
    });

    public isLoggedIn: Signal<boolean> = computed(() => this.getUserData() !== null)

    public getUserData(): UserData | null {
        return this.loggedInUserSignal();
    }


    public getRights(): ACCESS_RIGHTS {
        return this.getUserData()?.rights || ACCESS_RIGHTS.NONE;
    }

    public isAdmin(): boolean {
        return this.isLoggedIn() && this.getRights() === ACCESS_RIGHTS.ADMIN
    }

    public isUser(): boolean {
        return this.isLoggedIn() && (this.getRights() === ACCESS_RIGHTS.USER || this.getRights() === ACCESS_RIGHTS.ADMIN);
    }

    constructor(private dataService: DataService, private router: Router,
                protected messageService: MessageService,
    ) {
    }

    login(username: string, password: string): Observable<boolean> {
        console.log("LOGIN WITH: ", {username, password})

        // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
        return this.dataService.postData('/login', {username, password}).pipe(
            map((response): boolean => {
                console.log("LOGIN RESPONSE: ", response)
                // TODO: Somehow set the loggedInUser and rights
                localStorage.setItem('user_data', response.token);
                // this.loggedInUserSignal.set()
                this.messageService.add({severity: 'success', summary: 'Login erfolgreich', detail: 'Du hast dich erfolgreich eingeloggt!', life: 3000});
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
        localStorage.removeItem('user_data');
        this.loggedInUserSignal.set(null);
        this.messageService.add({severity: 'success', summary: 'Logout erfolgreich', detail: 'Du hast dich erfolgreich ausgeloggt!', life: 3000});
        this.router.navigate(['/'])
    }
}
