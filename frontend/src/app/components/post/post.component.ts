import { Component, Input } from '@angular/core';
import { Post } from 'src/app/typedefs/Post.typedef';

@Component({
  selector: 'ama-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() post!: Post;
}
