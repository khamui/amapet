import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

// pointing to remote backend
// const API = 'https://amapet-rest-api-ybteve7ska-ey.a.run.app/';
const API = 'http://localhost:5200/';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {

  constructor(private http: HttpClient) { }

  // create
  create = async(resource: string, payload: T) => {
    try {
      const response = await lastValueFrom(this.http.post(API + resource, payload));
      return { isError: false, result: response }
    } catch(error) {
      return { isError: true, result: error }
    }
  }

  // read
  read = async(resource: string) => {
    try {
      const response = await lastValueFrom(this.http.get(API + resource));
      return { isError: false, result: response }
    } catch(error) {
      return { isError: true, result: error }
    }
  }

  // update
  update = async(resource: string, payload: T) => {
    try {
      const response = await lastValueFrom(this.http.put(API + resource, payload));
      return { isError: false, result: response }
    } catch(error) {
      return { isError: true, result: error }
    }
  }

  // delete
  delete = async(resource: string) => {
    try {
      const response = await lastValueFrom(this.http.delete(API + resource));
      return { isError: false, result: response }
    } catch(error) {
      return { isError: true, result: error }
    }
  }
}
