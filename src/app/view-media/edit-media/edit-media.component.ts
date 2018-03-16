import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Media } from '../../media';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.scss']
})
export class EditMediaComponent implements OnInit {
  editDescription: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Media
  ) {
    this.editDescription = data.description == "";
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
