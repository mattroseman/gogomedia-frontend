import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';

import { ApiService, ApiResponse } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User;
  confirmedPassword: string;

  constructor(private apiService: ApiService, private router: Router) {
    this.user = {
      username: '',
      password: ''
    };
    this.confirmedPassword = '';
  }

  ngOnInit() {
  }

  signup() {
    // TODO validate the username and password more here
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
            // register wen't wrong, check message
            // TODO shouldn't rely on message like this (to tightly coupled)
            if (response === 'username taken') {
            }
          }
        });
    }
  }
}
