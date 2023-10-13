import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { Post } from 'src/app/typedefs/Post.typedef';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  public loading = false;

  constructor(private api: ApiService<Post>, private ms: MessageService) {}

  public postForm = new FormGroup({
    titleInput: new FormControl(''),
    bodyEditor: new FormControl('')
  })

  public submitPost = async () => {
    this.loading = true;
    const payload: Post = {
      topics: ['global'],
      title: this.postForm.value.titleInput as string,
      body: this.postForm.value.bodyEditor as string,
      author: 'Admin'
    };
    const response = await this.api.create('posts', payload);
    const { isError, result } = response;
    if (isError) {
      this.ms.add({
        severity: 'error',
        summary: 'Something went wrong!',
        detail: `Could not be created. Error: ${result}`,
      });
    } else {
      this.ms.add({
        severity: 'success',
        summary: 'Post created!',
        detail: 'Your post has been successfully created.',
      });
    }
    this.loading = false;
  };
}
