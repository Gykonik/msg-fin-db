import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

}
