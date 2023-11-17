import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {ThemeService} from "../services/theme.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserProfileComponent} from "../user-profile-component/user-profile.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  protected items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Budget Overview',
      icon: 'pi pi-fw pi-wallet',
      routerLink: '/budget-overview'
    },
    {
      label: 'Investment Planner',
      icon: 'pi pi-fw pi-chart-line',
      routerLink: '/investment-planner'
    },
    // Other menu items...
  ];

  constructor(protected themeService: ThemeService, public dialogService: DialogService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openUserProfile(): void {
    const ref: DynamicDialogRef = this.dialogService.open(UserProfileComponent, {
      header: 'User Profile',
      width: '80%'
    });
  }
}
