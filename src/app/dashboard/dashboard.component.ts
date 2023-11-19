import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {Expense} from "../types";
import * as echarts from "echarts";
import {ExpensesService} from "../services/expenses.service";

@Component({
    selector: 'app-dashboard-component',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    constructor(private expensesService: ExpensesService) {
    }

    ngOnInit(): void {
        this.initializeChart();
    }

    private initializeChart(): void {
        this.expensesService.getAllExpenses().subscribe(expensesData => {
            const chartData = this.processExpensesData(expensesData);
            console.log("Data: ", chartData);
            const chartInstance = echarts.init(document.getElementById('expensesCandlestickChart') as HTMLElement);

            chartInstance.setOption({
                title: {
                    text: 'Expenses Overview',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: chartData.map(item => item[0]), // Dates
                    scale: true,
                },
                yAxis: {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                },
                series: [{
                    name: 'Expenses',
                    type: 'candlestick',
                    data: chartData.map(item => {
                        // Adjusted to handle the new data structure
                        return item.value.slice(1); // Extracts OHLC data from the value array
                    }),
                    itemStyle: {
                        color: '#00da3c',
                        color0: '#ec0000',
                        borderColor: '#8A0000',
                        borderColor0: '#008F28'
                    }
                }],
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    show: true,
                    type: 'slider',
                    y: '90%',
                    start: 50,
                    end: 100
                }]
            });
        });
    }


    private processExpensesData(expenses: Expense[]): any[] {
        // Group expenses by date
        const groupedByDate: { [key: string]: number[] } = expenses.reduce((acc: any, expense: Expense) => {
            const expenseDate = new Date(expense.date);
            const dateKey = expenseDate.toISOString().split('T')[0]; // Extract the date part
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(expense.amount);
            return acc;
        }, {});

        // Process each group to find open, high, low, close
        return Object.entries(groupedByDate).map(([date, amounts]) => {
            const open = amounts[0];
            const close = amounts[amounts.length - 1];
            const high = Math.max(...amounts);
            const low = Math.min(...amounts);

            // Adjusted to include the date and ensure the format matches the expected structure
            return {
                value: [date, open, close, low, high],
                itemStyle: {
                    // Define any specific styles here if needed
                }
            };
        });
    }


}
