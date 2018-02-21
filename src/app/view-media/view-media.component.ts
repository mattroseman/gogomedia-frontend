import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';

import { MediaService } from '../media.service';

import { Media } from '../media';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {
  mediaList$: Observable<Media[]>;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.getMedia();
  }

  getMedia() {
    this.mediaList$ = this.mediaService.mediaUpdates.asObservable();
    this.mediaService.getMedia().subscribe();
  }

  delete(media: Media) {
    this.mediaService.deleteMedia(media).subscribe();
  }

  handleElementDrag(mediaElement: Media): void {
    this.mediaService.updateMedia({ 'name': mediaElement.name, 'consumed': !mediaElement.consumed ]).subscribe();
    console.log(`${mediaElement.name} moved`);
  }
}
