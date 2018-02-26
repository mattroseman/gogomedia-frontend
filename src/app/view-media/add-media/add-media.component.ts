import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.css']
})
export class AddMediaComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit() {
  }

  add(mediaName: string): void {
    if (!mediaName.trim()) {
      return;
    }

    this.apiService.addMedia({'name': mediaName, 'consumed': false}).subscribe();
    // TODO take the new media item, pass it up to app.component, so it can update the appropriate
    // components
  }
}
