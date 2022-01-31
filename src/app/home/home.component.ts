import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from './../_models';
import { UserService, AuthenticationService } from './../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentUser: User;
    users = [];

    constructor(
    ) {
    }

    ngOnInit() {

    }
}
