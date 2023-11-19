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
    private readonly USER_ENDPOINT: string = "user";

    private loggedInUserSignal: WritableSignal<UserData | null> = signal(null);

    public isLoggedIn: Signal<boolean> = computed(() => this.getUserData() !== null)

    public getUserId(): number {
        return this.getUserData()?.id || -1;
    }

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
        this.autoLogin()
    }

    private autoLogin(): void {
        const userDataJson = localStorage.getItem('user_data');
        if (userDataJson) {
            const userData: UserData = JSON.parse(userDataJson);
            this.loggedInUserSignal.set(userData);
        }
    }

    login(username: string, password: string): Observable<boolean> {
        console.log("LOGIN WITH: ", {username, password})

        // TODO: REPLACE ENDPOINT WITH REAL LOGIN ENDPOINT
        return this.dataService.postData(this.USER_ENDPOINT + '/login', {username, password}).pipe(
            map((response: any): boolean => {
                const userData: UserData = {
                    id: response.id,
                    firstname: response.firstname,
                    surname: response.surname,
                    username: response.username,
                    email: response.email,
                    rights: response.rights === "USER" ? ACCESS_RIGHTS.USER : response.rights === "ADMIN" ? ACCESS_RIGHTS.ADMIN : ACCESS_RIGHTS.NONE
                };

                localStorage.setItem('user_data', JSON.stringify(userData));
                this.loggedInUserSignal.set(userData);
                // this.loggedInUserSignal.set()
                this.messageService.add({severity: 'success', summary: 'Login erfolgreich', detail: 'Du hast dich erfolgreich eingeloggt!', life: 3000});
                return true; // Indicate successful login
            }),
            catchError((error) => {
                this.messageService.add({severity: 'error', summary: 'Login fehlgeschlagen!', detail: error.error.message, life: 3000});
                return throwError(error); // Forward the error
            })
        );
    }

    signup(user: UserData): Observable<boolean> {
        // TODO: REPLACE ENDPOINT WITH REAL REGISTER ENDPOINT
        return this.dataService.postData(this.USER_ENDPOINT + '/register', user).pipe(
            map((): boolean => {
                this.messageService.add({severity: 'success', summary: 'Registrierung erfolgreich!', detail: "Du hast dich erfolgreich registriert!", life: 3000});
                return true; // Indicate successful registration
            }),
            catchError((error) => {
                this.messageService.add({severity: 'error', summary: 'Registrierung fehlgeschlagen!', detail: error.error, life: 3000});
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
