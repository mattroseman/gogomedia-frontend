import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';

import { Media } from '../media';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})
export class ViewMediaComponent implements OnInit {
  notStartedMediaList: Media[];
  startedMediaList: Media[];
  finishedMediaList: Media[];

  showAudio: boolean;
  showFilm: boolean;
  showLiterature: boolean;
  showOther: boolean;

  constructor(private apiService: ApiService, private router: Router) {
    this.showAudio = true;
    this.showFilm = true;
    this.showLiterature = true;
    this.showOther = true;
  }

  ngOnInit() {
    // if the user isn't logged in yet, redirect to login page
    if (!this.apiService.loggedIn) {
      this.router.navigate(['/login']);
    }

    this.getMedia();
  }

  getMedia() {
    this.apiService.mediaUpdates
      .subscribe((media: Media[]) => {
        this.notStartedMediaList = media.filter((media: Media) => {return media.consumed_state === 'not started'});
        this.startedMediaList = media.filter((media: Media) => {return media.consumed_state === 'started'});
        this.finishedMediaList = media.filter((media: Media) => {return media.consumed_state === 'finished'});
      });

    this.apiService.getMedia().subscribe();
  }

  delete(media: Media) {
    this.apiService.deleteMedia(media).subscribe();
  }

  handleElementDrag(mediaElement: Media, currentList: Media[]): void {
    currentList.splice(currentList.indexOf(mediaElement), 1);

    if (this.notStartedMediaList.some((media: Media) => {return media.name === mediaElement.name;})) {
      mediaElement.consumed_state = 'not started';
    } else if (this.startedMediaList.some((media: Media) => {return media.name === mediaElement.name;})) {
      mediaElement.consumed_state = 'started';
    } else {
      mediaElement.consumed_state = 'finished';
    }

    this.apiService.updateMedia(mediaElement).subscribe();
  }

  handleAudioFilterClick(): void {
    this.showAudio = !this.showAudio;
  }

  handleFilmFilterClick(): void {
    this.showFilm = !this.showFilm;
  }

  handleLiteratureFilterClick(): void {
    this.showLiterature = !this.showLiterature
  }

  handleOtherFilterClick(): void {
    this.showOther = !this.showOther;
  }

  shouldShowMedia(media: Media): boolean {
    switch(media.medium) {
      case 'audio':
        return this.showAudio;

      case 'film':
        return this.showFilm;

      case 'literature':
        return this.showLiterature;

      default:
        return this.showOther;
    }
  }
}
