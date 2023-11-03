import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

// pointing to remote backend
// const API = 'https://amapet-rest-api-ybteve7ska-ey.a.run.app/';
// const API = 'https://amapet-rest-api-v0-0-1-ybteve7ska-lz.a.run.app/';
const API = 'http://localhost:5200/';

@Injectable({
  providedIn: 'root',
})
export class ApiService<T> {
  constructor(
    private http: HttpClient,
  ) {}

  private headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amapet_token')}`,
    },
  };

  // create as promise
  create = async (resource: string, payload: T, withAuth = true) => {
    try {
      const response = withAuth
        ? await lastValueFrom(
            this.http.post(API + resource, payload, this.headers),
          )
        : await lastValueFrom(this.http.post(API + resource, payload));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };

  // create as observable
  createAsObservable$ = <T>(resource: string, payload: T, withAuth = true) => {
    return withAuth
        ? this.http.post<T>(API + resource, payload, this.headers)
        : this.http.post<T>(API + resource, payload)
  };

  // read
  read = async (resource: string, withAuth = false) => {
    try {
      const response = withAuth
        ? await lastValueFrom(this.http.get(API + resource, this.headers))
        : await lastValueFrom(this.http.get(API + resource));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };

  // read
  readAsObservable$ = <T>(resource: string, withAuth = false) => {
    return withAuth
      ? this.http.get<T>(API + resource, this.headers)
      : this.http.get<T>(API + resource);
  };

  // update
  update = async (resource: string, payload: T, withAuth = false) => {
    try {
      const response = withAuth
        ? await lastValueFrom(
            this.http.put(API + resource, payload, this.headers),
          )
        : await lastValueFrom(this.http.put(API + resource, payload));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };

  // delete
  delete = async (resource: string, withAuth = true) => {
    try {
      const response = withAuth
        ? await lastValueFrom(this.http.delete(API + resource, this.headers))
        : await lastValueFrom(this.http.delete(API + resource));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };
}
