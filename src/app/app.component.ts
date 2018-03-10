import { Component, OnInit } from '@angular/core';

import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GoGoMedia';

  constructor(private apiService: ApiService) {}

  isLoggedIn(): boolean {
    return this.apiService.loggedIn;
  }

  logout(): void {
    this.apiService.logout().subscribe();
  }
}
