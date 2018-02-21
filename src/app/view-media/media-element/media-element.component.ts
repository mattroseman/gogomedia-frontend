import { Component, OnInit, Input } from '@angular/core';

import { MediaService } from '../../media.service';

import { Media } from '../../media';

@Component({
  selector: 'app-media-element',
  templateUrl: './media-element.component.html',
  styleUrls: ['./media-element.component.css']
})
export class MediaElementComponent implements OnInit {
  @Input('media') mediaElement: Media;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
  }

  delete(media: Media) {
    this.mediaService.deleteMedia(media).subscribe();
  }
}
