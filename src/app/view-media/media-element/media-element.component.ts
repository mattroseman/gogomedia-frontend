import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from '../../api.service';

import { Media } from '../../media';

@Component({
  selector: 'app-media-element',
  templateUrl: './media-element.component.html',
  styleUrls: ['./media-element.component.css']
})
export class MediaElementComponent implements OnInit {
  @Input('media') mediaElement: Media;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
  }

  delete(media: Media) {
    this.apiService.deleteMedia(media).subscribe();
  }
}
