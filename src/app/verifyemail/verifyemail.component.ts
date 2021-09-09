import { Component, OnInit } from '@angular/core';
import {  Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserService } from '../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { delay } from "rxjs/operators";
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
               private router: Router,
               private loading: NgxUiLoaderService,
               private authenticationService: AuthenticationService,
               private userService: UserService) {
    this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const requestObj = {
      token: this.id
    };
    this.loading.start();
    this.userService.verifyEmailAddress(this.constructor.name, moduleName.verifyEmailModule, requestObj).pipe(delay(2000))
    .subscribe((data) => {
      this.loading.stop();
      if(data){
        this.isUserVarified = true;
        this.message = 'Your email address is successfully verified ! please login to access your account!';
        this.authenticationService.isUserVerified.next(true);
        this.router.navigate(['/login'], { relativeTo: this.activatedRoute });
      }
    }, error => {
      this.loading.stop();
      this.isUserVarified = false;
      this.message = 'This link has been expired!';
      this.authenticationService.isUserVerified.next(false);
      this.router.navigate(['/verify-email/',this.id]);
    });
  }

}
