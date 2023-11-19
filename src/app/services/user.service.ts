import {Injectable} from "@angular/core";
import {DataService} from "./data.service";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly EXPENSE_ENDPOINT: string = "user";

    constructor(private dataService: DataService, private authService: AuthenticationService) {
    }

    getAllUsers(): Observable<any> {
        const endpoint: string = `${this.EXPENSE_ENDPOINT}/getAllUsers`;
        return this.dataService.getData(endpoint);
    }
}
