import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../api.service';

import { Media } from '../../media';

import { EditMediaComponent } from '../edit-media/edit-media.component';

@Component({
  selector: 'app-media-element',
  templateUrl: './media-element.component.html',
  styleUrls: ['./media-element.component.scss']
})
export class MediaElementComponent implements OnInit {
  @Input('media') mediaElement: Media;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
  }

  onSelect() {
    let dialogRef = this.dialog.open(EditMediaComponent, {
      width: '500px',
      panelClass: 'modal-dialog',
      data: JSON.parse(JSON.stringify(this.mediaElement))
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mediaElement = result;
        this.apiService.updateMedia(result).subscribe();
      }
    });
  }

  onDelete() {
    this.apiService.deleteMedia(this.mediaElement).subscribe();
  }
}
