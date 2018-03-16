import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MatIconRegistry]
})
export class AppComponent {
  title = 'GoGoMedia';

  constructor(
    private apiService: ApiService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  registerIcons(): void {
    this.iconRegistry.addSvgIcon('add', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/add_icon.svg'))
    this.iconRegistry.addSvgIcon('delete', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/delete_icon.svg'))
    this.iconRegistry.addSvgIcon('audio', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/audio_icon.svg'))
    this.iconRegistry.addSvgIcon('literature', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/book_icon.svg'))
    this.iconRegistry.addSvgIcon('film', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/film_icon.svg'))
    this.iconRegistry.addSvgIcon('other', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/other_icon.svg'))
    this.iconRegistry.addSvgIcon('edit', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/edit_icon.svg'))
    this.iconRegistry.addSvgIcon('preview', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/preview_icon.svg'))
  }

  isLoggedIn(): boolean {
    return this.apiService.loggedIn;
  }

  logout(): void {
    this.apiService.logout().subscribe();
  }
}
