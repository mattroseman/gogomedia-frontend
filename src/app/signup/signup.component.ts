import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = {
    username: "",
    password: ""
  }

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
  }

  signup() {
    // TODO validate the username and password more here
    if (this.user.username.trim() && this.user.password.trim()) {
      this.apiService.register(this.user.username, this.user.password)
        .subscribe(_ => {
          // TODO somehow know if register went wrong
          this.apiService.login(this.user.username, this.user.password)
            .subscribe(_ => {
              if (this.apiService.loggedIn) {
                this.router.navigate(['/media']);
              }
            });
        });
    }
  }
}
