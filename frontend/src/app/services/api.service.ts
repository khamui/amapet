import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

// pointing to remote backend
// const API = 'https://amapet-rest-api-ybteve7ska-ey.a.run.app/';
// const API = 'https://amapet-rest-api-v0-0-1-ybteve7ska-lz.a.run.app/';
const API = 'http://localhost:5200/';

@Injectable({
  providedIn: 'root',
})
export class ApiService<T> {
  constructor(private http: HttpClient) {}

  private getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amapet_token')}`,
    },
  });

  // create as promise
  create = async (resource: string, payload: T, withAuth = true) => {
    try {
      const response = withAuth
        ? await lastValueFrom(
            this.http.post(API + resource, payload, this.getHeaders()),
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
      ? this.http.post<T>(API + resource, payload, this.getHeaders())
      : this.http.post<T>(API + resource, payload);
  };

  // read
  read = async (resource: string, withAuth = false) => {
    try {
      const response = withAuth
        ? await lastValueFrom(this.http.get(API + resource, this.getHeaders()))
        : await lastValueFrom(this.http.get(API + resource));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };

  // read
  readAsObservable$ = <T>(resource: string, withAuth = false) => {
    return withAuth
      ? this.http.get<T>(API + resource, this.getHeaders())
      : this.http.get<T>(API + resource);
  };

  // update
  update = async (resource: string, payload: T, withAuth = false) => {
    try {
      const response = withAuth
        ? await lastValueFrom(
            this.http.put(API + resource, payload, this.getHeaders()),
          )
        : await lastValueFrom(this.http.put(API + resource, payload));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };

  // update as observable
  updateAsObservable$ = <T>(resource: string, payload: T, withAuth = true) => {
    return withAuth
      ? this.http.put<T>(API + resource, payload, this.getHeaders())
      : this.http.put<T>(API + resource, payload);
  };

  // delete
  delete = async (resource: string, withAuth = true) => {
    try {
      const response = withAuth
        ? await lastValueFrom(this.http.delete(API + resource, this.getHeaders()))
        : await lastValueFrom(this.http.delete(API + resource));
      return { isError: false, result: response };
    } catch (error) {
      return { isError: true, result: error };
    }
  };

  // delete as observable
  deleteAsObservable$ = <T>(resource: string, withAuth = true) => {
    return withAuth
      ? this.http.delete<T>(API + resource, this.getHeaders())
      : this.http.delete<T>(API + resource);
  };
}
