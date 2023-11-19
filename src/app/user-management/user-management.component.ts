import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AvatarModule} from "primeng/avatar";
import {UserData} from "../types";
import {GermanCurrencyPipe} from "../pipe/currency.pipe";
import {UserService} from "../services/user.service";
import {TableModule} from "primeng/table";
import {AccessRightsPipe} from "../pipe/access-right.pipe";


@Component({
    selector: 'app-user-management-component',
    standalone: true,
    imports: [CommonModule, AvatarModule, GermanCurrencyPipe, TableModule, AccessRightsPipe],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
    protected users: UserData[] = [];
    protected loading: boolean = false;

    constructor(
        protected userService: UserService,
    ) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.userService.getAllUsers().subscribe(
            (data: UserData[]) => {
                this.users = data;
                this.loading = false;
            },
            (error: any) => {
                console.error('Error fetching transaction sums:', error);
            }
        );
    }

}

