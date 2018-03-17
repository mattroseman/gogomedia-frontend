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
    if (!this.apiService.loggedIn()) {
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

  compareMedia(a: Media, b: Media): number {
    if (a.order < b.order) {
      return -1;
    } else if (a.order == b.order) {
      return 0;
    } else {
      return 1;
    }
  }

  getMedia() {
    this.apiService.mediaUpdates
      .subscribe((media: Media[]) => {
        this.notStartedMediaList = media.filter((media: Media) => { return media.consumed_state === 'not started'; });
        this.notStartedMediaList.sort(this.compareMedia);

        this.startedMediaList = media.filter((media: Media) => { return media.consumed_state === 'started'; });
        this.startedMediaList.sort(this.compareMedia);

        this.finishedMediaList = media.filter((media: Media) => { return media.consumed_state === 'finished'; });
        this.finishedMediaList.sort(this.compareMedia);
      });

    this.apiService.getMedia().subscribe();
  }

  updateOrder(mediaList: Media[]) {
    for (var i = 0; i < mediaList.length; i++) {
      mediaList[i].order = i;
    }
    this.apiService.updateMedia(mediaList).subscribe();
  }

  delete(media: Media) {
    // update the order of all elements in this list
    switch(media.consumed_state) {
      case 'not started':
        this.updateOrder(this.notStartedMediaList);
        break;

      case 'started':
        this.updateOrder(this.startedMediaList);
        break;

      default:
        this.updateOrder(this.finishedMediaList);
    }

    this.apiService.deleteMedia(media).subscribe();
  }

  handleElementDrag(mediaElement: Media, currentList: Media[]): void {
    // Remove this element from it's old list
    currentList.splice(currentList.indexOf(mediaElement), 1);

    // update the order of all elements in this list
    this.updateOrder(currentList);

    // Update the consumed_state of the mediaElement to match the list it was added to
    var index: number;

    index = this.indexOfMediaInList(mediaElement, this.notStartedMediaList);
    if (index >= 0) {
      // if the mediaElement is now in notStartedMediaList
      this.notStartedMediaList[index].consumed_state = 'not started';
      mediaElement.consumed_state = 'not started';

      // update the order of all elements in this list
      this.updateOrder(this.notStartedMediaList);
      mediaElement.order = this.indexOfMediaInList(mediaElement, this.notStartedMediaList);
    }

    index = this.indexOfMediaInList(mediaElement, this.startedMediaList);
    if (index >= 0) {
      // if the mediaElement is now in startedMediaList
      this.startedMediaList[index].consumed_state = 'started';
      mediaElement.consumed_state = 'started';

      // update the order of all elements in this list
      this.updateOrder(this.startedMediaList);
      mediaElement.order = this.indexOfMediaInList(mediaElement, this.startedMediaList);
    }

    index = this.indexOfMediaInList(mediaElement, this.finishedMediaList);
    if (index >= 0) {
      // if the mediaElement is now in finishedMediaList
      this.finishedMediaList[index].consumed_state = 'finished';
      mediaElement.consumed_state = 'finished';

      // update the order of all elements in this list
      this.updateOrder(this.finishedMediaList);
      mediaElement.order = this.indexOfMediaInList(mediaElement, this.finishedMediaList);
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
