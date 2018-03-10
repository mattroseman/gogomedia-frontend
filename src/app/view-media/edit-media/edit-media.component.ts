import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Media } from '../../media';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.css']
})
export class EditMediaComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Media
  ) {}

  ngOnInit() {
  }

  onClose() {
    // TODO forward the new media item to view media (or call api.service here)
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
