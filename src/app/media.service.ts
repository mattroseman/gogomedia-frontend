import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, tap } from 'rxjs/operators';

import { Media } from './media';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class MediaService {
  private apiUrl = 'http://localhost:5000';
  // TODO this is for testing, change when implementing login code
  private username = 'matt'

  // mediaUpdates keeps track of the current state of media elements for this user
  // when media elements are added/deleted/updated mediaUpdates publishes the new list of
  // media elements
  mediaUpdates = new Subject<Media[]>();
  // mediaUpdatesConsumed = new Subject<Media[]>();
  // mediaUpdatesUnconsumed = new Subject<Media[]>();

  constructor(private http: HttpClient) { }

  addMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    return this.http.put<Media>(url, media, httpOptions)
      .pipe(
        tap((media: Media) => {
          console.log(`added media with name: ${media.name}`)

          // call getMedia which will update mediaUpdates subject
          this.getMedia().subscribe();
        }),
        catchError(this.handleError<Media>(`addMedia`))
      );
  }

  updateMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    return this.http.put<Media>(url, media, httpOptions)
      .pipe(
        tap((media: Media) => {
          console.log(`updated media with name: ${media.name}`)

          this.getMedia().subscribe();
        }),
        catchError(this.handleError<Media>(`updateMedia`))
      );
  }

  getMedia(): Observable<Media[]> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    return this.http.get<Media[]>(url)
      .pipe(
        tap((media: Media[]) => {
          console.log(`got list of media`);

          // Add the new list of media elements to the subject mediaUpdates so any components
          // listening can update themselves
          this.mediaUpdates.next(media);
          // this.mediaUpdatesConsumed.next(media.filter((media: Media) => { return media.consumed }));
          // this.mediaUpdatesUnconsumed.next(media.filter((media: Media) => { return !media.consumed }));
        }),
        catchError(this.handleError<Media[]>(`getMedia`, []))
      );
  }

  deleteMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    // HttpClient delete method doesn't allow for a body, so a generic request is created
    return this.http.request('delete', url, {body: media, headers: httpOptions.headers})
      .pipe(
        tap(_ => {
          console.log(`deleted media with name: ${media.name}`)

          this.getMedia().subscribe();
        }),
        catchError(this.handleError<any>(`deleteMedia`))
      );
  }

  private handleError<T>(operation='operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed with error:\n${error.message}`);

      return of(result as T);
    };
  }
}
