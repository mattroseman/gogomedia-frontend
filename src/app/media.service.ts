import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, tap } from 'rxjs/operators';

import { Media } from './media';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable()
export class MediaService {
  private apiUrl = 'http://localhost:5000';
  // TODO this is for testing, change when implementing login code
  private username = 'matt';
  private authToken = '';

  // mediaUpdates keeps track of the current state of media elements for this user
  // when media elements are added/deleted/updated mediaUpdates publishes the new list of
  // media elements
  mediaUpdates = new Subject<Media[]>();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    this.username = username;
    const url = `${this.apiUrl}/login`;

    return this.http.post(url, {'username': username, 'password': password}, {headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
      .pipe(
        tap((response: any) => {
          if (response.success) {
            console.log(`logged in as user: ${username}`);
            this.authToken = response.auth_token;

            this.getMedia().subscribe();
          } else {
            console.log(`failed to log in as user: ${username}`);
            console.log(response.message);
          }
        }),
        catchError(this.handleError<any>(`login`))
      );
  }

  addMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    return this.http.put<Media>(url, media, {headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authToken
    })})
      .pipe(
        tap((response: any) => {
          if (response.success) {
            console.log(`added media with name: ${response.data.name}`)

            // call getMedia which will update mediaUpdates subject
            this.getMedia().subscribe();
          } else {
            console.log(response.message);
          }

        }),
        catchError(this.handleError<Media>(`addMedia`))
      );
  }

  updateMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    return this.http.put<Media>(url, media, {headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authToken
    })})
      .pipe(
        tap((response: any) => {
          if (response.success) {
            console.log(`updated media with name: ${response.data.name}`)

            this.getMedia().subscribe();
          } else {
            console.log(response.message);
          }
        }),
        catchError(this.handleError<Media>(`updateMedia`))
      );
  }

  getMedia(): Observable<Media[]> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    return this.http.get<Media[]>(url, {headers: new HttpHeaders({
      'Authorization': 'JWT ' + this.authToken
    })})
      .pipe(
        tap((response: any) => {
          if (response.success) {
            console.log(`got list of media`);

            // Add the new list of media elements to the subject mediaUpdates so any components
            // listening can update themselves
            this.mediaUpdates.next(response.data);
          } else {
            console.log(response.message);
          }
        }),
        catchError(this.handleError<Media[]>(`getMedia`, []))
      );
  }

  deleteMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;

    // HttpClient delete method doesn't allow for a body, so a generic request is created
    return this.http.request('delete', url, {body: media, headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + this.authToken
    })})
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
