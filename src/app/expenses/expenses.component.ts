import {Component, OnInit, ViewChild} from '@angular/core';
import {ExpensesService} from '../services/expenses.service'; // Update path as necessary
import {ConfirmationService, MessageService} from 'primeng/api';
import {Table, TableLazyLoadEvent, TableModule, TablePageEvent} from 'primeng/table';
import {Column, Expense} from "../types";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {GermanDatePipe} from "../pipe/date.pipe";
import {CapitalizePipe} from "../pipe/capitalize.pipe";
import {GermanCurrencyPipe} from "../pipe/currency.pipe";
import {DefaultValuePipe} from "../pipe/default-value.pipe";
import {MultiSelectModule} from "primeng/multiselect";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {InputNumberModule} from "primeng/inputnumber";
import {Utils} from "../utils/utils";
import {tap} from "rxjs";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        GermanDatePipe,
        CapitalizePipe,
        GermanCurrencyPipe,
        DefaultValuePipe,
        MultiSelectModule,
        FormsModule,
        DialogModule,
        ReactiveFormsModule,
        CalendarModule,
        InputNumberModule,
        ConfirmDialogModule,
    ]
})
export class ExpensesComponent implements OnInit {
    @ViewChild("dt") dataTable: Table | undefined;

    totalRecords: number = 0;
    expenses: Expense[] = [];
    selectedExpenses: Expense[] | null = null;
    currentExpense: Expense | null = null;
    expenseDialogVisible: boolean = false;
    submitted: boolean = false;
    expenseDialogMode: "ADD" | "EDIT" | null = null;
    columns: Column[] = [
        {field: 'id', header: 'ID', filterType: "numeric"},
        {field: 'name', header: 'Name', inputType: "text", required: true, getDefaultValue: () => "",
        filterType: "text"},
        {field: 'description', header: 'Description', pipe: "defaultValue", inputType: "text", getDefaultValue: () => "",
        filterType: "text"},
        {field: 'category', header: 'Category', pipe: "defaultValue", inputType: "text", getDefaultValue: () => "",
        filterType: "text"},
        {
            field: 'amount',
            header: 'Amount',
            pipe: "germanCurrency",
            classFunction: (value: any): string => Utils.getCurrencyClass(value),
            inputType: "currency",
            required: true,
            getDefaultValue: () => 0,
            filterType: "numeric"
        },
        {
            field: 'date',
            header: 'Date',
            pipe: "germanDate",
            inputType: "date",
            required: true,
            getDefaultValue: () => new Date(),
            filterType: "date"
        }
    ];

    loading: boolean = false;
    selectedColumns: Column[] = [];

    protected getAllColumnFields(): string[] {
        return this.selectedColumns.map((column: Column): string => column.field);
    }

    protected getCurrencyClass(column: Column): string {
        if (column.inputType !== "currency") return "";
        return Utils.getCurrencyClass(this.expenseForm.controls[column.field].value);
    }

    protected getCurrencyPrefix(column: Column): string {
        if (column.inputType !== "currency") return "";
        const value = this.expenseForm.controls[column.field].value;
        if (value < 0) return ""; // If value < 0, PrimeNG automatically adds "-"
        return Utils.getCurrencyPrefix(this.expenseForm.controls[column.field].value);
    }

    resetSelectedColumns(): void {
        this.selectedColumns = [...this.columns]
    }

    resetFilters() {
        this.dataTable?.clear()
    }

    protected exportToExcel(): void {
        // Format the current date
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Rest of the export logic
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.expenses);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data: Blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});

        // Append the current date to the filename
        FileSaver.saveAs(data, `Expenses_${formattedDate}.xlsx`);
    }

    resetTable(): void {
        this.resetSelectedColumns();
        this.resetFilters();
    }

    private sendCreateExpenseRequest(expense: Expense): void {
        console.log("ADD VALID EXPENSE...", expense);
        this.expenseService.addExpense(expense).pipe(
            tap({
                next: (success: boolean): void => {
                    if (success) {
                        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Expense Added', life: 3000});
                        this.fetchExpenses();
                        this.hideDialog()
                    } else {
                        // TODO: Show error message...
                    }
                },
                error: (error) => {
                    console.error('Add expense failed', error);
                    // TODO: Handle server error, shot error message using PrimeNG
                }
            })
        ).subscribe();
    }

    private sendEditExpenseRequest(expense: Expense): void {
        console.log("EDIT EXPENSE...", expense);
        this.expenseService.updateExpense(expense).pipe(
            tap({
                next: (success: boolean): void => {
                    if (success) {
                        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Expense Updated', life: 3000});
                        this.fetchExpenses();
                        this.hideDialog()
                    } else {
                        // TODO: Show error message...
                    }
                },
                error: (error) => {
                    console.error('Edit expense failed', error);
                    // TODO: Handle server error, shot error message using PrimeNG
                }
            })
        ).subscribe();
    }

    onSubmit() {
        if (this.expenseForm.valid) {
            const expense: Expense = {...this.currentExpense, ...this.expenseForm.getRawValue()};
            if (this.expenseDialogMode === "ADD") {
                // Process the form data
                this.sendCreateExpenseRequest(expense)
            } else if (this.expenseDialogMode === "EDIT") {
                this.sendEditExpenseRequest(expense);
            }
        } else {
            Object.keys(this.expenseForm.controls).forEach(field => {
                const control = this.expenseForm.get(field);
                control?.markAsTouched({onlySelf: true});
            });
        }
    }


    expenseForm!: FormGroup;

    constructor(
        private expenseService: ExpensesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {
        this.resetSelectedColumns()
        this.createExpenseForm();
    }

    private createExpenseForm(): void {
        let controls: any = {};
        this.columns.forEach((column: Column): void => {
            if (!this.isInputField(column)) return;
            if (column.required) controls[column.field] = [column.getDefaultValue!(), Validators.required]
            else controls[column.field] = [column.getDefaultValue!()]
        });
        this.expenseForm = this.fb.group(controls);
    }

    protected isInputField(column: Column): boolean {
        return !!column.inputType && !!column.getDefaultValue
    }

    ngOnInit() {
        this.fetchExpenses();
        console.log("Columns: ", this.columns)
    }

    fetchExpenses(event?: TableLazyLoadEvent): void {
        this.loading = true;
        const page: number = (event?.first ?? 0) / (event?.rows ?? 10);
        const sortField: any = event?.sortField ?? 'date';
        const sortOrder: string = event?.sortOrder === 1 ? 'asc' : 'desc';
        const filters = event?.filters;

        this.expenseService.getExpenses(page, event?.rows ?? 10, sortField, sortOrder, filters).subscribe(response => {
            this.expenses = response.content;
            this.totalRecords = response.totalElements;
            this.loading = false; // End loading
        }, error => {
            this.loading = false; // End loading in case of error
        });
    }


    openNew() {
        this.currentExpense = {id: 0, name: '', description: '', category: '', amount: 0, date: new Date()};
        this.expenseDialogMode = "ADD";
        this.openExpenseDialog()
    }

    openEditExpense(expense: Expense) {
        this.currentExpense = {...expense};
        // Update form values
        this.expenseForm.patchValue(expense);
        // Open Dialog
        this.expenseDialogMode = "EDIT";
        this.openExpenseDialog()
    }

    deleteExpenseConfirmation(expense: Expense) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${expense.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.expenseService.deleteExpense(expense).subscribe(() => {
                    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Expense Deleted', life: 3000});
                    this.fetchExpenses();
                });
            }
        });
    }

    deleteSelectedExpensesConfirmation() {
        if (!this.selectedExpenses || this.selectedExpenses.length === 0) {
            this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'No Expenses Selected', life: 3000});
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete all the selected expenses? You have selected ' + this.selectedExpenses.length + ' expenses',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (!this.selectedExpenses) return;
                this.expenseService.deleteMultipleExpenses(this.selectedExpenses).subscribe(() => {
                    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Expenses Deleted', life: 3000});
                    this.fetchExpenses();
                    this.selectedExpenses = null;
                });
            }
        });
    }

    isInvalid(col: Column): boolean {
        return this.expenseForm.controls[col.field].invalid && (this.expenseForm.controls[col.field].dirty || this.expenseForm.controls[col.field].touched)
    }

    openExpenseDialog(): void {
        this.expenseDialogVisible = true;
        this.submitted = false;
    }

    hideDialog(): void {
        this.expenseDialogVisible = false;
        this.currentExpense = null;
        this.expenseDialogMode = null;
        this.submitted = false;

        // TODO: RESET ALL FORM FIELDS
        this.resetFormToDefaults()
    }

    getDefaultFormValues(): any {
        let defaultValues: any = {};
        this.columns.forEach((column: Column) => {
            if (this.isInputField(column)) {
                defaultValues[column.field] = column.getDefaultValue!();
            }
        });
        return defaultValues;
    }

    resetFormToDefaults(): void {
        this.expenseForm.reset(this.getDefaultFormValues());
    }


    protected filterTable(dataTable: Table, event: Event): void {
        const value = (event.target as HTMLInputElement)?.value;
        dataTable.filterGlobal(value, 'contains');
    }

    protected readonly fetch = fetch;
}
