import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  public registerForm!: FormGroup;

  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    })
  }

  submit(): void {
    console.log(this.registerForm.value);
    this.authService.register({
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    }).subscribe({
      next: data => {
        this.notificationService.showSnackBar('Successfully registered!');
      },
      error: error => {
        this.notificationService.showSnackBar('Failed to register!');
      }
    })
  }

}
