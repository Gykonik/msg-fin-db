import { Component } from '@angular/core';
import {NavbarComponent} from "./navbar/navbar.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {Router, RouterOutlet} from "@angular/router";
import {ToastModule} from "primeng/toast";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    NavbarComponent,
    DashboardComponent,
    RouterOutlet,
    ToastModule,
    NgClass
  ],
  standalone: true
})
export class AppComponent {
  protected title: string = 'msg';

  constructor(private router: Router) {}

  useBackground(): boolean {
    return ["/home", "/login"].includes(this.router.url);
  }
}
