export enum ACCESS_RIGHTS {
    NONE,
    USER,
    ADMIN
}

export interface Column {
    field: string; // field name
    header: string; // Usable name / header for table columns
    getDefaultValue?: () => any; // Get the default value
    pipe?: "germanDate" | "capitalize" | "germanCurrency" | "defaultValue";
    classFunction?: (value: any) => string;
    filterType?: "text" | "numeric" | "date" | "boolean";
    filterValues?: any[]; // List of all available filter values
    inputType?: "number" | "date" | "text" | "currency";
    required?: boolean;
    disabled?: boolean;
}

export interface Expense {
    id: number;
    name: string;
    description: string;
    category: string;
    amount: number;
    date: Date;
}

export interface BudgetPlanEntry {
    id: number;
    category: string;
    currentAmount?: number;
    plannedAmount?: number;
}

export interface UserData {
    id: number;
    firstname: string;
    surname: string;
    username: string;
    email: string;
    rights?: ACCESS_RIGHTS;
}
