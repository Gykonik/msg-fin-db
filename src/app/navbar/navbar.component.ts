import {Component, effect, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Menubar, MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {ThemeService} from "../services/theme.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {ButtonModule} from "primeng/button";
import {AuthenticationService} from "../services/authentication.service";

@Component({
    selector: 'app-navbar-component',
    standalone: true,
    imports: [CommonModule, MenubarModule, ButtonModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    @ViewChild("mb") menuBar: Menubar | undefined;

    protected hasVisibleItems(): boolean {
        return this.items.some((item: MenuItem) => item.visible);
    }

    protected items: MenuItem[] = [];

    private initNavbarItems(): void {
        this.items = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: '/dashboard',
                visible: this.authService.isLoggedIn()
            },
            {
                label: 'Haushaltsbuch',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: '/expenses',
                visible: this.authService.isLoggedIn()
            },
            {
                label: 'Budget Planung',
                icon: 'pi pi-fw pi-wallet',
                routerLink: '/budget-planning',
                visible: this.authService.isLoggedIn()
            },
            {
                label: 'Konten',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: '/accounts',
                visible: this.authService.isLoggedIn()
            },
            {
                label: 'Benutzer Verwalten',
                icon: 'pi pi-fw pi-chart-line',
                routerLink: '/manage-users',
                visible: this.authService.isLoggedIn() && this.authService.isAdmin()
            }
        ];
    }

    constructor(protected authService: AuthenticationService,
                protected themeService: ThemeService, public dialogService: DialogService) {
        this.initNavbarItems()

        effect(() => {
            this.authService.isLoggedIn();
            this.initNavbarItems()
        })
    }

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
