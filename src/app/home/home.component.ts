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
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
       // this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
      //  console.log(this.currentUser,'currentuser home..');
       // if(!this.currentUser){
          //  this.loadAllUsers();
       // }
    }

    // deleteUser(id: number) {
    //     this.userService.delete(id)
    //         .pipe(first())
    //         .subscribe(() => this.loadAllUsers());
    // }

    // private loadAllUsers() {
    //     console.log('home...');
    //     this.userService.getAll()
    //         .pipe(first())
    //         .subscribe(users => this.users = users);
    // }
}
