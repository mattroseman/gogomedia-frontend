import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, tap, map } from 'rxjs/operators';

import { Media } from './media';

import { environment } from '../environments/environment';

// ApiResponse is the format response from the api will take
export class ApiResponse {
  // status represents the success/failure of the request
  success: boolean;
  // message contains info on what whent wrong, or what was done successfully
  message: string;
}

export class RegisterApiResponse extends ApiResponse {}

export class LoginApiResponse extends ApiResponse {
  // auth_token contains a signed authentication token, used for authenticating the user after login
  auth_token: string;
}

export class LogoutApiResponse extends ApiResponse {}

export class AddApiResponse extends ApiResponse {
  // data includes the newly added media element
  data: Media;
}

export class UpdateApiResponse extends ApiResponse {
  // data includes the newly updated media element
  data: Media;
}

export class DeleteApiResponse extends ApiResponse {}

export class GetApiResponse extends ApiResponse {
  // data includes the list of media elements gotten
  data: Media[];
}

//const apiUrl = 'https://gogomedia-backend.herokuapp.com';
const apiUrl = environment.apiUrl;

@Injectable()
export class ApiService {
  public loggedIn;
  private currentUser;
  private authToken;

  // mediaUpdates keeps track of the current state of media elements for this user
  // when media elements are added/deleted/updated mediaUpdates publishes the new list of
  // media elements
  mediaUpdates = new Subject<Media[]>();
  currentMediaList: Media[];

  constructor(private http: HttpClient) {
    this.loggedIn = false;
    this.currentUser = '';
    this.authToken = '';
  }

  /*
  register takes a username and password and registeres a new user with the API
  @return: an observable with a type string that will be 'success' or an error message
   */
  register(username: string, password: string): Observable<string> {
    // TODO hash this password
    const url = `${apiUrl}/register`;
    const body = {
      'username': username,
      'password': password
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, options)
      .pipe(
        map((response: RegisterApiResponse) => {
          console.log(`user: ${username} was successfully registered`);
          return 'success';
        }),
        catchError(this.handleError(`register`))
      );
  }

  /*
  login takes a username and password and logs in the user with the API
  @return: an observable with a type string that will be 'success' or an error message
   */
  login(username: string, password: string): Observable<string> {
    // TODO hash this password
    const url = `${apiUrl}/login`;
    const body = {
      'username': username,
      'password': password
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, options)
      .pipe(
        map((response: LoginApiResponse) => {
          console.log(`user: ${username} was successfully logged in`);

          this.loggedIn = true;
          this.currentUser = username;
          this.authToken = response.auth_token;

          this.getMedia().subscribe();

          return 'success';
        }),
        catchError(this.handleError(`login`, () => {
          this.loggedIn = false;
          this.currentUser = '';
          this.authToken = '';
        }))
      );
  }

  /*
  logout logs the current user out with the API
  @return: an observable with a type string that will be 'success' or an error message
   */
  logout(): Observable<string> {
    if (!this.loggedIn) {
      return of('not logged in');
    }

    const url = `${apiUrl}/logout`;
    const options = {
      headers: new HttpHeaders({
        'Authorization': `JWT ${this.authToken}`
      })
    }

    return this.http.get(url, options)
      .pipe(
        map((response: LogoutApiResponse) => {
          console.log(`user: ${this.currentUser} was successfully logged out`);

          this.loggedIn = false;
          this.currentUser = '';
          this.authToken = '';

          return 'success';
        }),
        catchError(this.handleError(`logout`, () => {
          this.loggedIn = false;
          this.currentUser = '';
          this.authToken = '';
        }))
      );
  }

  /*
  addMedia takes a media object and adds it for the current user with the API
  @return: an observable with a type Media if successful or type string that will be an error message
   */
  addMedia(media: Media): Observable<Media | string> {
    const url = `${apiUrl}/user/${this.currentUser}/media`;
    const body = media;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `JWT ${this.authToken}`
      })
    };

    return this.http.put(url, body, options)
      .pipe(
        map((response: AddApiResponse) => {
          console.log(`media: ${response.data.name} was successfully added`);

          this.currentMediaList.push(response.data);
          this.mediaUpdates.next(this.currentMediaList);

          return response.data;
        }),
        catchError(this.handleError(`addMedia`))
      );
  }

  updateMedia(media: Media): Observable<Media | string> {
    const url = `${apiUrl}/user/${this.currentUser}/media`;
    const body = media;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `JWT ${this.authToken}`
      })
    };

    return this.http.put(url, body, options)
      .pipe(
        map((response: UpdateApiResponse) => {
          console.log(`media: ${response.data.name} was successfully updated`);

          this.currentMediaList = this.currentMediaList.map((mediaElement: Media) => {
            if (mediaElement.name === response.data.name) {
              mediaElement = response.data;
            }
            return mediaElement;
          });
          this.mediaUpdates.next(this.currentMediaList);

          return response.data;
        }),
        catchError(this.handleError(`updateMedia`))
      );
  }

  getMedia(): Observable<Media[] | string> {
    const url = `${apiUrl}/user/${this.currentUser}/media`;
    const options = {
      headers: new HttpHeaders({
        'Authorization': `JWT ${this.authToken}`
      })
    };

    return this.http.get(url, options)
      .pipe(
        map((response: GetApiResponse) => {
          console.log(`list of media was successfully gotten`);

          this.currentMediaList = response.data;
          this.mediaUpdates.next(this.currentMediaList);

          return response.data;
        }),
        catchError(this.handleError(`getMedia`))
      );
  }

  deleteMedia(media: Media): Observable<string> {
    const url = `${apiUrl}/user/${this.currentUser}/media`;
    const options = {
      body: media,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `JWT ${this.authToken}`
      })
    };

    // HttpClient delete method doesn't allow for a body, so a generic request is created
    return this.http.request('delete', url, options)
      .pipe(
        map((response: DeleteApiResponse) => {
          console.log(`media: ${media.name} was deleted successfully`);

          this.currentMediaList = this.currentMediaList.filter((mediaElement: Media) => {
            return mediaElement.name !== media.name;
          });
          this.mediaUpdates.next(this.currentMediaList);

          return 'success';
        }),
        catchError(this.handleError(`deleteMedia`))
      );
  }

  private handleError(operation='operation', callback?: () => void) {
    return (error: any): Observable<string> => {
      if (callback) callback();
      console.error(`${operation} failed with error: ${error.error.message}`);

      return of(error.error.message);
    };
  }
}
