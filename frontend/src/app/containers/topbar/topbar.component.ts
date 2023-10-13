import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/typedefs/Post.typedef';

@Component({
  selector: 'ama-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [MessageService],
})
export class TopbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private api: ApiService<Post>,
    private ms: MessageService,
    public router: Router,
    public as: AuthService
  ) {}

  ngOnInit(): void {
    // imperative? depending on which this.as method is called first. Bad!
    this.as.loggedIn.subscribe((value) => {
      this.isLoggedIn = value as boolean;
    })
    this.as.check();
  }

  addPost = async () => {
    const payload: Post = {
      title: 'This is a test post',
      body: 'For now it is hardcoded.',
      author: 'khamui',
      topics: [],
    };
    const response = await this.api.create('posts', payload);
    const { isError, result } = response;

    if (isError) {
      this.ms.add({
        severity: 'error',
        summary: 'Not created!',
        detail: 'Post could not be saved.',
      });
    } else {
      this.ms.add({
        severity: 'success',
        summary: 'Saved!',
        detail: 'Post saved successfully.',
      });
    }
  };
}
