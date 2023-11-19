import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {Utils} from "../utils/utils";
import {GermanCurrencyPipe} from "../pipe/currency.pipe";
import {ExpensesService} from "../services/expenses.service";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, RouterLink, GermanCurrencyPipe],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    protected moneySpent: number = 0;
    protected moneyEarned: number = 0;

    constructor(
        protected authService: AuthenticationService,
        private expensesService: ExpensesService
    ) {
    }

    ngOnInit(): void {
        this.expensesService.getSumOfTransactions().subscribe(
            (data: any) => {
                this.moneySpent = data.negative;
                this.moneyEarned = data.positive;
            },
            (error: any) => {
                console.error('Error fetching transaction sums:', error);
            }
        );
    }


    protected readonly Utils = Utils;
}
