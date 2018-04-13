import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api.service';

import { Media } from '../../media';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss']
})
export class AddMediaComponent implements OnInit {
  media: Media = {
    name: '',
    medium: 'other',
    consumed_state: 'not started',
    description: '',
    order: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
  }

  add(): void {
    if (!this.media.name.trim()) {
      return;
    }

    this.apiService.addMedia(this.media).subscribe();

    this.media.name = '';
  }

  onKey(event: any): void {
    if (event.key === 'Enter') {
      this.add();
    }
  }
}
