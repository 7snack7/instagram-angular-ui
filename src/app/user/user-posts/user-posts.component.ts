import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {PostService} from '../../service/post.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {CommentService} from '../../service/comment.service';
import {NotificationService} from '../../service/notification.service';

@Component({
  selector: 'app-user-posts',
  standalone: false,
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent implements OnInit {

  isUserPostsLoaded: boolean = false;
  posts: Post[] = [];

  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private commentService: CommentService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.postService.getPostForCurrentUser().subscribe({
      next: data => {
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isUserPostsLoaded = true;
      }
    });
  }

  getImagesToPosts(posts: Post[]) {
    posts.forEach(post => {
      this.imageService.getImageToPost(post.id).subscribe({
        next: data => {
          post.image = data.imageBytes;
        }
      });
    });
  }

  getCommentsToPosts(posts: Post[]) {
    posts.forEach(post => {
      this.commentService.getCommentsToPosts(post.id).subscribe({
        next: data => {
          post.comments = data;
        }
      });
    });
  }

  removePost(post: Post, index: number) {
    const result = confirm('Are you sure?');
    if (result) {
      this.postService.delete(post.id!).subscribe({
        next: data => {
          this.posts.splice(index, 1);
          this.notificationService.showSnackBar('Post deleted successfully.');
        }
      });
    }
  }

  formatImage(image: any):any {
    if (image == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + image;
  }

  deleteComment(commentId: number,postIndex: number,commentIndex: number) {
    const post = this.posts[postIndex];

    this.commentService.delete(commentId).subscribe({
      next: data => {
        this.notificationService.showSnackBar('Comment deleted successfully.');
        post.comments?.splice(commentIndex, 1);
      }
    })
  }
}
