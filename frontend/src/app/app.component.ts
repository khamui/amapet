import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of people
  people: any[] = [];

  constructor(private http: HttpClient) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllPosts();
  }

  // Add one person to the API
  addPost() {
    this.http.post(`${this.API}/posts`, {title: 'Blablub', body: 'yapyap'})
      .subscribe((data: any) => {
        console.log(data)
        //this.getAllPeople();
      }, (error: any) => {console.log(error);});
  }

  // Get all users from the API
  getAllPosts() {
    this.http.get(`${this.API}/posts`)
      .subscribe((posts : any )=> {
        console.log('POSTS', posts)
        this.people = posts
      }, (error: any) => {console.log(error);});
  }
}
