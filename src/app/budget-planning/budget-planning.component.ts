import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BudgetPlanEntry, Column} from "../types";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CapitalizePipe} from "../pipe/capitalize.pipe";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DefaultValuePipe} from "../pipe/default-value.pipe";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GermanCurrencyPipe} from "../pipe/currency.pipe";
import {GermanDatePipe} from "../pipe/date.pipe";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {Utils} from "../utils/utils";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import {tap} from "rxjs";
import {BudgetService} from "../services/budget.service";

@Component({
    selector: 'app-budget-overview-component',
    standalone: true,
    imports: [CommonModule, ButtonModule, CalendarModule, CapitalizePipe, ConfirmDialogModule, DefaultValuePipe, DialogModule, FormsModule, GermanCurrencyPipe, GermanDatePipe, InputNumberModule, InputTextModule, MultiSelectModule, RippleModule, SharedModule, TableModule, ToolbarModule, ReactiveFormsModule],
    templateUrl: './budget-planning.component.html',
    styleUrls: ['./budget-planning.component.scss']
})
export class BudgetPlanningComponent {
    @ViewChild("dt") dataTable: Table | undefined;

    budgetPlan: BudgetPlanEntry[] = [];
    selectedBudget: BudgetPlanEntry[] | null = null;
    currentBudget: BudgetPlanEntry | null = null;
    budgetDialogVisible: boolean = false;
    submitted: boolean = false;
    budgetDialogMode: "ADD" | "EDIT" | null = null;
    columns: Column[] = [
        {field: 'category', header: 'Kategorie', inputType: "text", required: true, getDefaultValue: () => ""},
        {
            field: 'currentBudget', header: 'Aktuelles Budget', pipe: "germanCurrency",
            inputType: "currency",
            disabled: true,
            getDefaultValue: () => 0,
            classFunction: (value: any): string => "current-budget"
        },
        {
            field: 'plannedBudget', header: 'Geplantes Budget', pipe: "germanCurrency",
            inputType: "currency", getDefaultValue: () => 0,
            classFunction: (value: any): string => "planned-budget",
        },
    ];

    selectedColumns: Column[] = [];


    protected getBudgetClass(budget: BudgetPlanEntry): string {
        if(!budget.currentBudget || !budget.plannedBudget) return "neutral"
        if(budget.currentBudget > budget.plannedBudget) return "over-budget";
        else return "under-budget";
    }

    protected getBudgetClassFromForm(col: Column): string {
        const current = this.budgetForm.controls["currentBudget"].value;
        const planned = this.budgetForm.controls["plannedBudget"].value;
        const colClass: string = col.classFunction!(this.budgetForm.controls[col.field].value);

        if(!current || !planned) return "neutral " + colClass;
        if(current > planned) return "over-budget " + colClass;
        else return "under-budget " + colClass;
    }

    protected getAllColumnFields(): string[] {
        return this.selectedColumns.map((column: Column): string => column.field);
    }

    protected getCurrencyClass(column: Column): string {
        if (column.inputType !== "currency") return "";
        return Utils.getCurrencyClass(this.budgetForm.controls[column.field].value);
    }

    protected getCurrencyPrefix(column: Column): string {
        if (column.inputType !== "currency") return "";
        const value = this.budgetForm.controls[column.field].value;
        if (value < 0) return ""; // If value < 0, PrimeNG automatically adds "-"
        return Utils.getCurrencyPrefix(this.budgetForm.controls[column.field].value);
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
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.budgetPlan);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');

        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
        const data: Blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});

        // Append the current date to the filename
        FileSaver.saveAs(data, `Budget-Plan_${formattedDate}.xlsx`);
    }

    resetTable(): void {
        this.resetSelectedColumns();
        this.resetFilters();
    }

    private sendCreateBudgetRequest(budget: BudgetPlanEntry): void {
        console.log("ADD VALID BUDGET...", budget);
        this.budgetPlanningService.addBudget(budget).pipe(
            tap({
                next: (success: boolean): void => {
                    if (success) {
                        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Budget Added', life: 3000});
                        this.fetchBudgets();
                        this.hideDialog()
                    } else {
                        // TODO: Show error message...
                    }
                },
                error: (error) => {
                    console.error('Add budget failed', error);
                    // TODO: Handle server error, shot error message using PrimeNG
                }
            })
        ).subscribe();
    }

    private sendEditBudgetRequest(budget: BudgetPlanEntry): void {
        console.log("EDIT BUDGET...", budget);
        this.budgetPlanningService.updateBudget(budget).pipe(
            tap({
                next: (success: boolean): void => {
                    if (success) {
                        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Budget Updated', life: 3000});
                        this.fetchBudgets();
                        this.hideDialog()
                    } else {
                        // TODO: Show error message...
                    }
                },
                error: (error) => {
                    console.error('Edit budget failed', error);
                    // TODO: Handle server error, shot error message using PrimeNG
                }
            })
        ).subscribe();
    }

    onSubmit() {
        if (this.budgetForm.valid) {
            const budget: BudgetPlanEntry = {...this.currentBudget, ...this.budgetForm.getRawValue()};
            if (this.budgetDialogMode === "ADD") {
                // Process the form data
                this.sendCreateBudgetRequest(budget)
            } else if (this.budgetDialogMode === "EDIT") {
                this.sendEditBudgetRequest(budget);
            }
        } else {
            Object.keys(this.budgetForm.controls).forEach(field => {
                const control = this.budgetForm.get(field);
                control?.markAsTouched({onlySelf: true});
            });
        }
    }


    budgetForm!: FormGroup;

    constructor(
        private budgetPlanningService: BudgetService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {
        this.resetSelectedColumns()
        this.createBudgetForm();
    }

    private createBudgetForm(): void {
        let controls: any = {};
        this.columns.forEach((column: Column): void => {
            if (!this.isInputField(column)) return;
            if (column.required) controls[column.field] = [column.getDefaultValue!(), Validators.required]
            else controls[column.field] = [column.getDefaultValue!()]
        });
        this.budgetForm = this.fb.group(controls);
        this.columns.forEach((col: Column) => {
            if(col.disabled) this.budgetForm.controls[col.field].disable()
        })
    }

    protected isInputField(column: Column): boolean {
        return !!column.inputType && !!column.getDefaultValue
    }

    ngOnInit() {
        this.fetchBudgets();
        console.log("Columns: ", this.columns)
    }

    getAllColumnsAsEnabled(): Column[] {
        return [...this.columns].map((c: Column) => {
            c.disabled = false;
            return c;
        });
    }


    fetchBudgets() {
        this.budgetPlanningService.getBudgets().subscribe((data: BudgetPlanEntry[]) => {
            this.budgetPlan = data
        });

        this.budgetPlan = [
            {id: 1, category: 'Groceries', currentBudget: 200, plannedBudget: 250},
            {id: 2, category: 'Sample', currentBudget: 300, plannedBudget: 250},
            {id: 3, category: 'Utilities', plannedBudget: 150},
            {id: 4, category: 'Entertainment', currentBudget: 100}]
    }

    openNew() {
        this.currentBudget = {id: 0, category: '', currentBudget: 0, plannedBudget: 0};
        this.budgetDialogMode = "ADD";
        this.openBudgetDialog()
    }

    openEditBudget(budget: BudgetPlanEntry): void {
        this.currentBudget = {...budget};
        // Update form values
        this.budgetForm.patchValue(budget);
        // Open Dialog
        this.budgetDialogMode = "EDIT";
        this.openBudgetDialog()
    }

    deleteBudgetConfirmation(budget: BudgetPlanEntry): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${budget.category}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.budgetPlanningService.deleteBudget(budget).subscribe(() => {
                    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Budget Deleted', life: 3000});
                    this.fetchBudgets();
                });
            }
        });
    }

    deleteSelectedBudgetsConfirmation() {
        if (!this.selectedBudget || this.selectedBudget.length === 0) {
            this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'No Budgets Selected', life: 3000});
            return;
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete all the selected budgets? You have selected ' + this.selectedBudget.length + ' budgets',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (!this.selectedBudget) return;
                this.budgetPlanningService.deleteMultipleBudgets(this.selectedBudget).subscribe(() => {
                    this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Budgets Deleted', life: 3000});
                    this.fetchBudgets();
                    this.selectedBudget = null;
                });
            }
        });
    }

    isInvalid(col: Column): boolean {
        return this.budgetForm.controls[col.field].invalid && (this.budgetForm.controls[col.field].dirty || this.budgetForm.controls[col.field].touched)
    }

    openBudgetDialog(): void {
        this.budgetDialogVisible = true;
        this.submitted = false;
    }

    hideDialog(): void {
        this.budgetDialogVisible = false;
        this.currentBudget = null;
        this.budgetDialogMode = null;
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
        this.budgetForm.reset(this.getDefaultFormValues());
    }


    protected filterTable(dataTable: Table, event: Event): void {
        const value = (event.target as HTMLInputElement)?.value;
        dataTable.filterGlobal(value, 'contains');
    }
}
