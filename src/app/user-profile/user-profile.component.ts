import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from "../services/authentication.service";
import {AvatarModule} from "primeng/avatar";
import {ACCESS_RIGHTS} from "../types";
import {GermanCurrencyPipe} from "../pipe/currency.pipe";
import {Utils} from "../utils/utils";


@Component({
    selector: 'app-user-profile-component',
    standalone: true,
    imports: [CommonModule, AvatarModule, GermanCurrencyPipe],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
    protected moneySpent: number = -124.23;
    protected moneyEarned: number = 9823;

    constructor(protected authService: AuthenticationService) {

    }

    accessRightsToString(right: ACCESS_RIGHTS | undefined): string {
        return (right === ACCESS_RIGHTS.ADMIN) ? "Admin" : (right === ACCESS_RIGHTS.USER) ? "User" : "Keine";
    }

    protected readonly Utils = Utils;
}

