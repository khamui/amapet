import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/typedefs/Post.typedef';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  posts: any;

  constructor(private api: ApiService<Post>, private ms: MessageService) {}

  ngOnInit() {
    this.getAllPosts();
  }

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
      this.posts = (result as Array<Post>).reverse();
      this.ms.add({
        severity: 'success',
        summary: 'Loaded!',
        detail: 'List of posts successfully loaded.',
      });
    }
  };
}
