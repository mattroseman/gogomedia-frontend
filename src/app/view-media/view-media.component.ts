import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { MediaService } from '../media.service';

import { Media } from '../media';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {
  consumedMediaList: Media[];
  unconsumedMediaList: Media[];

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.getMedia();
  }

  getMedia() {
    this.mediaService.mediaUpdates
      .subscribe((media: Media[]) => {
        // TODO manually remove deleted elements, and added elements to end, but mantain order from last instance
        this.consumedMediaList = media.filter((media: Media) => {return media.consumed});
        this.unconsumedMediaList = media.filter((media: Media) => {return !media.consumed});
      });

    this.mediaService.getMedia().subscribe();
  }

  delete(media: Media) {
    this.mediaService.deleteMedia(media).subscribe();
  }

  handleElementDrag(mediaElement: Media, currentList: Media[]): void {
    currentList.splice(currentList.indexOf(mediaElement), 1);
    this.mediaService.updateMedia({ 
      'name': mediaElement.name, 
      'consumed': this.consumedMediaList.some((media: Media) => {return media.name === mediaElement.name;})
    }).subscribe();
  }
}
