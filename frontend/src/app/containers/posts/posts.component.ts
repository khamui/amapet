import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/typedefs/Post.typedef';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  providers: [MessageService]
})
export class PostsComponent implements OnInit {
  posts: any;

  constructor(private api: ApiService<Post>, private ms: MessageService) {}

  ngOnInit() {
    this.getAllPosts();
  }

  // Add one person to the API
  addPost = async () => {
    const payload: Post = {
      title: 'This is a test post',
      body: 'For now it is hardcoded.',
      author: 'khamui',
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

  // Get all users from the API
  getAllPosts = async () => {
    const response = await this.api.read('posts');
    const { isError, result } = response;

    if (isError) {
      this.ms.add({
        severity: 'error',
        summary: 'Not loaded!',
        detail: 'List of posts could not be loaded.',
      });
    } else {
      this.posts = result;
      this.ms.add({
        severity: 'success',
        summary: 'Loaded!',
        detail: 'List of posts successfully loaded.',
      });
    }
  };
}
