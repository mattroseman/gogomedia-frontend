import { Component, OnInit } from '@angular/core';

import { MediaService } from '../media.service';

import { Media } from '../media';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {
  media: Media[] = [];

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.getMedia();
  }

  getMedia() {
    this.mediaService.getMedia()
      .subscribe((media: Media[]) => this.media = media);
  }
}
