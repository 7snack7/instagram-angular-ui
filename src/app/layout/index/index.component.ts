import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {User} from '../../models/User';
import {PostService} from '../../service/post.service';
import {UserService} from '../../service/user.service';
import {CommentService} from '../../service/comment.service';
import {NotificationService} from '../../service/notification.service';
import {ImageUploadService} from '../../service/image-upload.service';

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {

  isPostsLoaded = false;
  posts!: Post[];
  isUserDataLoaded = false;
  user!: User;

  constructor(private postService: PostService,
              private userService: UserService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService
  ) { }

  ngOnInit() {
    this.postService.getAllPosts().subscribe({
      next: data => {
        this.posts = data;
        this.getImageToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isPostsLoaded = true;
      },
      error: error => {
        console.log(error);
      }
    });

    this.userService.getCurrentUser().subscribe({
      next: data => {
        this.user = data;
        this.isUserDataLoaded = true;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getImageToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id).subscribe({
        next: data => {
          p.image = data.imageBytes;
        }
      });
    });
  }

  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPosts(p.id).subscribe({
        next: data => {
          p.comments = data;
        }
      });
    });
  }

  likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];
    if (!post.usersLikes?.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username).subscribe({
        next: () => {
          post.usersLikes?.push(this.user.username);
          this.notificationService.showSnackBar('Liked!')
        }
      });
    } else {
      this.postService.likePost(postId, this.user.username).subscribe({
        next: () => {
          const index = post.usersLikes?.indexOf(this.user.username, 0);
          if (index! >= 0) {
            post.usersLikes?.splice(index!, 1);
          }
        }
      });
    }
  }

  postComment(message: string, postId: number, postIndex: number): void {
    const post = this.posts[postIndex];
    console.log(post);
    this.commentService.addCommentToPost(postId, message).subscribe({
      next: data => {
        post.comments?.push(data);
      }
    });
  }

  formatImage(img: any): any {
    if (img == null) { return null; }
    return 'data:image/jpg;base64,' + img;
  }
}
