import {Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {UserService} from '../../service/user.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {PostService} from '../../service/post.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NotificationService} from '../../service/notification.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {EditUserComponent} from '../edit-user/edit-user.component';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  isUserDataLoaded: boolean = false;
  user!: User;
  selectedFile!: File;
  userProfileImage!: File;
  previewImageUrl: any;

  constructor(private tokenService: TokenStorageService,
              private postService: PostService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private imageService: ImageUploadService,
              private userService: UserService
              ) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: data => {
        this.user = data;
        this.isUserDataLoaded = true;
      }
    });
    this.imageService.getProfileImage().subscribe({
      next: data => {
        this.userProfileImage = data.imageBytes;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onloadend = () => {
      this.previewImageUrl = reader.result;
    };
  }

  openEditDialog(): void {
    const dialogUserEditConfig = new MatDialogConfig();
    dialogUserEditConfig.width = '400px';
    dialogUserEditConfig.data = {
      user: this.user
    }
    this.dialog.open(EditUserComponent, dialogUserEditConfig);
  }

  formatImage(img: any): any {
    if (img == null) { return null; }
    return 'data:image/jpg;base64,' + img;
  }

  onUpload() {
    if (this.selectedFile !== null) {
      this.imageService.uploadImageToUser(this.selectedFile).subscribe({
        next: data => {
          this.notificationService.showSnackBar('Profile image uploaded successfully.');
        }
      });
    }
  }
}
