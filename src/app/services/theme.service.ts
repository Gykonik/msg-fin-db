import {Inject, Injectable, signal, WritableSignal} from '@angular/core';
import {DOCUMENT} from "@angular/common";

export type Theme = 'dark' | 'light';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private currentThemeSignal: WritableSignal<Theme>;

    constructor() {
        // Check for stored theme in localStorage or default to 'light'
        const storedTheme: Theme = (localStorage.getItem('theme') as Theme) || this.getPreferredTheme();
        this.currentThemeSignal = signal(storedTheme);
        this.applyTheme(storedTheme);
    }

    public currentTheme(): Theme {
        return this.currentThemeSignal();
    }

    toggleTheme(): void {
        const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
        this.currentThemeSignal.set(newTheme);
        this.applyTheme(newTheme);
    }

    private applyTheme(theme: Theme): void {
        const body: HTMLElement = document.body;
        body.classList.toggle('theme-light', theme === 'light');
        body.classList.toggle('theme-dark', theme === 'dark');
        localStorage.setItem('theme', theme); // Store the new theme
    }

    private getPreferredTheme(): Theme {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
