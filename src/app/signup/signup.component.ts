import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm, FormGroup } from '@angular/forms'

import { User } from '../user';

import { ApiService, ApiResponse } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('signupForm') signupForm: FormGroup;
  user: User;
  confirmedPassword: string;
  passwordsDontMatch: boolean;
  usernameTaken: boolean;

  constructor(private apiService: ApiService, private router: Router) {
    this.user = {
      username: '',
      password: ''
    };
    this.confirmedPassword = '';
    this.passwordsDontMatch = false;
    this.usernameTaken = false;
  }

  ngOnInit() {
  }

  private markFormPristine(form: FormGroup | NgForm): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  signup() {
    // TODO validate the username and password more here
    this.passwordsDontMatch = false;
    this.usernameTaken = false;
    this.markFormPristine(this.signupForm);

    if (this.user.password !== this.confirmedPassword) {
      this.passwordsDontMatch = true;
      return;
    }

    if (this.user.username.trim() && this.user.password.trim()) {
      this.apiService.register(this.user.username, this.user.password)
        .subscribe((response: string) => {
          if (response === 'success') {
            this.apiService.login(this.user.username, this.user.password)
              .subscribe(_ => {
                if (this.apiService.loggedIn) {
                  this.router.navigate(['/media']);
                }
              });
          } else {
            if (response === 'username taken') {
              this.usernameTaken = true;
            }
          }
        });
    }
  }
}
