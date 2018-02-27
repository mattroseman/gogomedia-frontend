import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    username: "",
    password: ""
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
  }

  login() {
    // TODO validate the username and password more here
    if (this.user.username.trim() && this.user.password.trim()) {
      this.apiService.login(this.user.username, this.user.password)
        .subscribe((response: string) => {
          if (response === 'success') {
            this.router.navigate(['/media']);
          } else {
            // TODO display this error message on the page
          }
        });
    }
  }
}
