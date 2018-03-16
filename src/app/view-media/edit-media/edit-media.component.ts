import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { Media } from '../../media';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.scss'],
  providers: [MatIconRegistry]
})
export class EditMediaComponent implements OnInit {
  editDescription: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Media
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.editDescription = data.description == "";
    this.registerIcons();
  }

  ngOnInit() {
  }

  registerIcons(): void {
    this.iconRegistry.addSvgIcon('edit', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/edit_icon.svg'))
    this.iconRegistry.addSvgIcon('preview', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/preview_icon.svg'))
  }

  onClose() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
