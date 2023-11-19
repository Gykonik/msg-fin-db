import {Component, effect, HostListener} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import * as echarts from "echarts";
import {ExpensesService} from "../services/expenses.service";
import {BudgetService} from "../services/budget.service";
import {Theme, ThemeService} from "../services/theme.service";

@Component({
    selector: 'app-dashboard-component',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    public static readonly SCATTER_POINT_SCALE_FACTOR: number = 25;

    private barChartInstance: echarts.ECharts | null = null;
    private scatterChartInstance: echarts.ECharts | null = null;
    private candlestickChartInstance: echarts.ECharts | null = null;


    badgeLevel: string = "";
    badgeMessage: string = "";
    badgeDescription: string = "";

    constructor(private expensesService: ExpensesService, private budgetService: BudgetService, private themeService: ThemeService) {
        effect(() => {
            const theme: Theme = this.themeService.getCurrentTheme();
            // "theme" = "dark" | "light"
            this.redrawCharts();
        })
        this.loadBadgeLevel();
    }


    private loadBadgeLevel(): void {
        this.budgetService.getBadgeLevel().subscribe({
            next: (response) => {
                this.badgeLevel = response.level;
                this.updateBadgeInfo();
            },
            error: (err) => {
                console.log("Error: ", err);
                // Handle error
            }
        });
    }

    private updateBadgeInfo(): void {
        switch (this.badgeLevel) {
            case 'Gold':
                this.badgeMessage = "Du machst das großartig";
                this.badgeDescription = "Deine Budgettreue ist ausgezeichnet. Mach weiter so!";
                break;
            case 'Silver':
                this.badgeMessage = "Gut gemacht, aber es gibt noch Verbesserungspotenzial";
                this.badgeDescription = "Du bist ziemlich nah an deinem Budget, aber du kannst deine Ausgaben noch optimieren.";
                break;
            case 'Bronze':
                this.badgeMessage = "Versuche in Zukunft etwas mehr zu sparen!";
                this.badgeDescription = "Du weichst von deinem Budget ab. Überprüfe und passe deine Ausgabengewohnheiten an.";
                break;
            default:
                this.badgeMessage = "Unbekannt";
                this.badgeDescription = "Dein Budgettreue-Level konnte nicht bestimmt werden.";
                break;
        }
    }


    ngOnInit(): void {
        this.initializeChart();
    }


    private redrawCharts(): void {
        this.disposeChart(this.barChartInstance);
        this.disposeChart(this.scatterChartInstance);
        this.disposeChart(this.candlestickChartInstance);

        this.initializeChart();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.resizeCharts();
    }

    private resizeCharts(): void {
        this.resizeChart(this.barChartInstance);
        this.resizeChart(this.scatterChartInstance);
        this.resizeChart(this.candlestickChartInstance);
    }

    private resizeChart(chartInstance: echarts.ECharts | null): void {
        if (chartInstance) {
            chartInstance.resize();
        }
    }

    private disposeChart(chartInstance: echarts.ECharts | null): void {
        if (chartInstance) {
            chartInstance.dispose();
        }
    }

    private initializeChart(): void {
        this.initBarChart();
        this.initScatterChart();
        this.initCandlestickChart();
    }


    private initBarChart(): void {
        this.budgetService.getBudgetBarChart().subscribe((response: any) => {
            const categories = response.category;
            const actualValues = response.actualAmount;
            const plannedValues = response.plannedAmount;

            this.barChartInstance = echarts.init(document.getElementById('barChart') as HTMLElement);


            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ["Aktuelles Budget", "Geplantes Budget"]
                },
                xAxis: {
                    type: 'category',
                    data: categories
                },
                yAxis: [  // Define the y-axis configuration here
                    {
                        type: 'value',  // Assuming a numerical y-axis
                    },
                ],
                series: [
                    {
                        name: "Aktuelles Budget",
                        type: 'bar',
                        data: actualValues
                    },
                    {
                        name: "Geplantes Budget",
                        type: 'bar',
                        data: plannedValues
                    }
                ]
            };

            this.barChartInstance.setOption(option);
        })
    }

    private initScatterChart(): void {
        this.expensesService.getWeeklyScatterChart().subscribe((response: any) => {
            const chartData = response.scatterData;
            const minValue = response.minValue;
            const maxValue = response.maxValue;

            // Define a function to normalize the values to a range of 0-1
            const normalize = (value: number) => (maxValue - value) / (maxValue - minValue);

            this.scatterChartInstance = echarts.init(document.getElementById('scatterChart') as HTMLElement);
            const hours = [
                '12a', '1a', '2a', '3a', '4a', '5a', '6a',
                '7a', '8a', '9a', '10a', '11a',
                '12p', '1p', '2p', '3p', '4p', '5p',
                '6p', '7p', '8p', '9p', '10p', '11p'
            ];
            const days = [
                'Montag', 'Dienstag', 'Mittwoch',
                'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'
            ];
            const title: any[] = [];
            const singleAxis: any[] = [];
            const series: any[] = [];

            days.forEach(function (day, idx) {
                title.push({
                    textBaseline: 'middle',
                    top: ((idx + 0.5) * 100) / 7 + '%',
                    text: day
                });
                singleAxis.push({
                    left: 150,
                    type: 'category',
                    boundaryGap: false,
                    data: hours,
                    top: (idx * 100) / 7 + 5 + '%',
                    height: 100 / 7 - 10 + '%',
                    axisLabel: {
                        interval: 2
                    }
                });
                series.push({
                    singleAxisIndex: idx,
                    coordinateSystem: 'singleAxis',
                    type: 'scatter',
                    data: [],
                    symbolSize: function (dataItem: any) {
                        // Normalize the value and scale it
                        const normalizedSize = normalize(dataItem[2]);
                        return normalizedSize * DashboardComponent.SCATTER_POINT_SCALE_FACTOR;
                    }
                })
            });

            // chartData.forEach(function (dataItem: any) {
            //     series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
            // });
            // Populate the series data
            chartData.forEach(function (dataItem: any) {
                const dayIndex = dataItem[0]; // Day of the week index
                const hourIndex = dataItem[1]; // Hour of the day index
                const value = dataItem[2]; // Value

                // Ensure the dataItem is structured as [x, y, value]
                series[dayIndex].data.push([hourIndex, value, value]);
            });

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: (params: any) => {
                        let result = params[0].name + '<br/>';
                        params.forEach((param: any) => {
                            result += `Ausgaben: ${Math.round(param.data[param.seriesIndex])}€<br/>`;
                        });
                        return result;
                    }
                },
                title: title,
                singleAxis: singleAxis,
                series: series
            };

            this.scatterChartInstance.setOption(option);
        });
    }

    private initCandlestickChart(): void {
        this.expensesService.getCandlestickChartData().subscribe((chartData: any) => {
            this.candlestickChartInstance = echarts.init(document.getElementById('expensesCandlestickChart') as HTMLElement);

            this.candlestickChartInstance.setOption({
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
                    data: chartData.map((item: any) => item.date), // Use date from each data point
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
                    data: chartData.map((item: any) => [item.open, item.close, item.low, item.high]),
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

}
