import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

type AsyncResponse<T> =
  | { isError: false; result: T }
  | { isError: true; result: Error }; // Or a specific backend error type

const API = environment.apiUrl;

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
  read = async <T>(
    resource: string,
    withAuth = false,
  ): Promise<AsyncResponse<T>> => {
    try {
      const url = API + resource;
      const request$ = withAuth
        ? this.http.get<T>(url, this.getHeaders())
        : this.http.get<T>(url);

      const response = await lastValueFrom(request$);

      return { isError: false, result: response };
    } catch (error) {
      // Ensure the error is actually an Error object
      return {
        isError: true,
        result: error instanceof Error ? error : new Error(String(error)),
      };
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
  updateAsObservable$ = <T>(
    resource: string,
    payload?: T | unknown,
    withAuth = true,
  ) => {
    return withAuth
      ? this.http.put<T>(API + resource, payload, this.getHeaders())
      : this.http.put<T>(API + resource, payload);
  };

  // delete
  delete = async (resource: string, withAuth = true) => {
    try {
      const response = withAuth
        ? await lastValueFrom(
            this.http.delete(API + resource, this.getHeaders()),
          )
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
