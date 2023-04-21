import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public currentTheme: string;

  constructor() {
  }

  public setTheme(theme?: string): void {
    this.currentTheme = theme || localStorage.getItem('theme') || 'light';
    const body = document.getElementsByTagName('body')[0];
    document.documentElement.dataset.theme = this.currentTheme;

    if (this.currentTheme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', this.currentTheme);
  }
}
