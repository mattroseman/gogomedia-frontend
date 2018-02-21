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

  // These variables can both be true, or one can be true
  // but they can't both be false
  showConsumed = true;
  showUnconsumed = true;

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

  handleConsumedClick() {
    this.showConsumed = !this.showConsumed;
  }

  handleUnconsumedClick() {
    this.showUnconsumed = !this.showUnconsumed;
  }
}
