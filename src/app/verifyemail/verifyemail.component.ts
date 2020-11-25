import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { moduleName } from '../_constant/module-name.constant';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  public id: string;
  isUserVarified = false;
  message: string;
  constructor( private activatedRoute: ActivatedRoute,
               private loading: NgxUiLoaderService,
               private userService: UserService) {
    this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const requestObj = {
      token: this.id
    };
    this.loading.start();
    this.userService.verifyEmailAddress(this.constructor.name, moduleName.verifyEmailModule, requestObj).subscribe((data) => {
      this.loading.stop();
      this.isUserVarified = true;
      this.message = 'Your email address is successfully verified ! please login to access your account!';
    }, error => {
      this.loading.stop();
      this.isUserVarified = false;
      this.message = 'This link has been expired!';
    });
  }

}
