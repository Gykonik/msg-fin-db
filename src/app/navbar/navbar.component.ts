import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {ThemeService} from "../services/theme.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {ButtonModule} from "primeng/button";
import {AuthenticationService} from "../services/authentication.service";
import {Menu} from "primeng/menu";

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  protected hasVisibleItems(): boolean {
    return this.items.some((item: MenuItem) => item.visible)
  }

  protected items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      routerLink: '/dashboard',
      visible: this.authService.isUser()
    },
    {
      label: 'Haushaltsbuch',
      icon: 'pi pi-fw pi-chart-line',
      routerLink: '/expenses',
      visible: this.authService.isUser()
    },
    {
      label: 'Budget Planung',
      icon: 'pi pi-fw pi-wallet',
      routerLink: '/budget-planning',
      visible: this.authService.isUser()
    },
    {
      label: 'Konten',
      icon: 'pi pi-fw pi-chart-line',
      routerLink: '/accounts',
      visible: this.authService.isUser()
    },
    {
      label: 'Benutzer Verwalten',
      icon: 'pi pi-fw pi-chart-line',
      routerLink: '/manage-users',
      visible: this.authService.isAdmin()
    },
    // Other menu items...
  ];

  constructor(private authService: AuthenticationService, protected themeService: ThemeService, public dialogService: DialogService) {}

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
