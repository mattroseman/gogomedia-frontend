import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm, FormGroup } from '@angular/forms'

import { User } from '../user';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: FormGroup;
  user: User;
  userDoesntExist: boolean;
  incorrectPassword: boolean;

  constructor(private apiService: ApiService, private router: Router) {
    this.user = {
      username: '',
      password: ''
    }
    this.userDoesntExist = false;
    this.incorrectPassword = false;
  }

  ngOnInit() {
  }

  /*
  markFormPristine updates the control status of form elements without changing the current value
   */
  private markFormPristine(form: FormGroup | NgForm): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }

  login() {
    this.userDoesntExist = false;
    this.incorrectPassword = false;
    this.markFormPristine(this.loginForm);

    // TODO validate the username and password more here
    if (this.user.username.trim() && this.user.password.trim()) {
      this.apiService.login(this.user.username, this.user.password)
        .subscribe((response: string) => {
          if (response === 'success') {
            this.router.navigate(['/media']);
          } else {
            if (response === 'user doesn\'t exist') {
              this.userDoesntExist = true;
            } else if (response === 'incorrect password') {
              this.incorrectPassword = true;
            } else {
              // TODO idk what could go wrong here, but put in some way to handle it
              // probably have user login again?
            }
          }
        });
    }
  }
}
