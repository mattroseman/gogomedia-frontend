import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';

import { Media } from '../media';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.scss']
})
export class ViewMediaComponent implements OnInit {
  notStartedMediaList: Media[];
  startedMediaList: Media[];
  finishedMediaList: Media[];

  showAudio: boolean;
  showFilm: boolean;
  showLiterature: boolean;
  showOther: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.notStartedMediaList = [];
    this.startedMediaList = [];
    this.finishedMediaList = [];

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

  onAllFilterClick(): void {
    if (this.showAudio && this.showFilm && this.showLiterature && this.showOther) {
      this.showAudio = false;
      this.showFilm = false;
      this.showLiterature = false;
      this.showOther = false;
    } else {
      this.showAudio = true;
      this.showFilm = true;
      this.showLiterature = true;
      this.showOther = true;
    }
  }

  indexOfMediaInList(media: Media, mediaList: Media[]): number {
    for (var i = 0; i < mediaList.length; i++) {
      if (mediaList[i].id === media.id) {
        return i
      }
    }

    return -1
  }

  getMedia() {
    this.apiService.mediaUpdates
      .subscribe((media: Media[]) => {
        var newNotStartedMediaList = media.filter((media: Media) => {return media.consumed_state === 'not started';});
        var newStartedMediaList = media.filter((media: Media) => {return media.consumed_state === 'started';});
        var newFinishedMediaList = media.filter((media: Media) => {return media.consumed_state === 'finished';});

        // Add new elements
        for (var newMedia of newNotStartedMediaList) {
          var index = this.indexOfMediaInList(newMedia, this.notStartedMediaList);
          if (index < 0) {
            this.notStartedMediaList.push(newMedia);
          }
        }

        for (var newMedia of newStartedMediaList) {
          var index = this.indexOfMediaInList(newMedia, this.startedMediaList);
          if (index < 0) {
            this.startedMediaList.push(newMedia);
          }
        }

        for (var newMedia of newFinishedMediaList) {
          var index = this.indexOfMediaInList(newMedia, this.finishedMediaList);
          if (index < 0) {
            this.finishedMediaList.push(newMedia);
          }
        }

        // Remove old elements
        this.notStartedMediaList = this.notStartedMediaList.filter((oldMedia: Media) => {
          return this.indexOfMediaInList(oldMedia, newNotStartedMediaList) >= 0;
        });

        this.startedMediaList = this.startedMediaList.filter((oldMedia: Media) => {
          return this.indexOfMediaInList(oldMedia, newStartedMediaList) >= 0;
        });

        this.finishedMediaList = this.finishedMediaList.filter((oldMedia: Media) => {
          return this.indexOfMediaInList(oldMedia, newFinishedMediaList) >= 0;
        });

        // Update existing elements
        this.notStartedMediaList = this.notStartedMediaList.map((oldMedia: Media) => {
          return newNotStartedMediaList[this.indexOfMediaInList(oldMedia, newNotStartedMediaList)];
        });

        this.startedMediaList = this.startedMediaList.map((oldMedia: Media) => {
          return newStartedMediaList[this.indexOfMediaInList(oldMedia, newStartedMediaList)];
        });

        this.finishedMediaList = this.finishedMediaList.map((oldMedia: Media) => {
          return newFinishedMediaList[this.indexOfMediaInList(oldMedia, newFinishedMediaList)];
        });
      });

    this.apiService.getMedia().subscribe();
  }

  delete(media: Media) {
    this.apiService.deleteMedia(media).subscribe();
  }

  handleElementDrag(mediaElement: Media, currentList: Media[]): void {
    // Remove this element from it's old list
    currentList.splice(this.indexOfMediaInList(mediaElement, currentList), 1);

    // Update the consumed_state of the mediaElement to match the list it was added to
    var index: number;

    index = this.indexOfMediaInList(mediaElement, this.notStartedMediaList);
    if (index >= 0) {
      this.notStartedMediaList[index].consumed_state = 'not started';
      mediaElement.consumed_state = 'not started';
    }

    index = this.indexOfMediaInList(mediaElement, this.startedMediaList);
    if (index >= 0) {
      this.startedMediaList[index].consumed_state = 'started';
      mediaElement.consumed_state = 'started';
    }

    index = this.indexOfMediaInList(mediaElement, this.finishedMediaList);
    if (index >= 0) {
      this.finishedMediaList[index].consumed_state = 'finished';
      mediaElement.consumed_state = 'finished';
    }

    this.apiService.updateMedia(mediaElement).subscribe();
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
