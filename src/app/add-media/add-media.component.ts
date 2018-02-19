import { Component, OnInit } from '@angular/core';

import { MediaService } from '../media.service';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.css']
})
export class AddMediaComponent implements OnInit {
  constructor(private mediaService: MediaService) {}

  ngOnInit() {
  }

  add(mediaName: string): void {
    this.mediaService.addMedia({name: mediaName, consumed: false}).subscribe();
    // TODO take the new media item, pass it up to app.component, so it can update the appropriate
    // components
  }
}
