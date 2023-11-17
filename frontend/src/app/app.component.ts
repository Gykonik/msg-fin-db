import { Component } from '@angular/core';
import {NavbarComponent} from "./navbar-component/navbar.component";
import {DashboardComponent} from "./dashboard-component/dashboard.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NavbarComponent,
    DashboardComponent,
    RouterOutlet
  ],
  standalone: true
})
export class AppComponent {
  protected title: string = 'msg';
}
