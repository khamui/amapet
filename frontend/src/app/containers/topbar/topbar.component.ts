import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { Post } from 'src/app/typedefs/Post.typedef';

@Component({
  selector: 'ama-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [MessageService],
})
export class TopbarComponent {
  constructor(
    private api: ApiService<Post>,
    private ms: MessageService,
    public router: Router
  ) {}

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
