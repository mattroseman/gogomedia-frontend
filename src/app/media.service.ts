import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Media } from './media';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' });
}

@Injectable()
export class MediaService {
  private apiUrl = 'http://localhost:5000';
  // TODO this is for testing, change when implementing login code
  private username = 'matt'

  constructor(private http: HttpClient) { }

  addMedia(media: Media): Observable<Media> {
    const url = `${this.apiUrl}/user/${this.username}/media`;
    return this.http.put<Media>(url, media, httpOptions)
      .pipe(
        tap((media: Media) => console.log(`added media with name: ${media.name}`)),
        catchError(this.handleError<Media>(`addMedia`))
      );
  }

  private handleError<T>(operation='operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed with error:\n${error}`);

      return of(result as T);
    };
  }
}
