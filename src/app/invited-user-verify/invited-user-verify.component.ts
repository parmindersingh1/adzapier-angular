import {Component, OnDestroy, OnInit} from '@angular/core';
import {moduleName} from '../_constant/module-name.constant';
import {delay} from 'rxjs/operators';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {AuthenticationService, OrganizationService, UserService} from '../_services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-invited-user-verify',
  templateUrl: './invited-user-verify.component.html',
  styleUrls: ['./invited-user-verify.component.scss']
})
export class InvitedUserVerifyComponent implements OnInit, OnDestroy {
  id: any = 'gdfsgsd';
  isInvitedUserVerified = false;
  message = '';
  constructor(
    private loader: NgxUiLoaderService,
    private userService: UserService,
    private authService : AuthenticationService,
    private orgservice : OrganizationService,
    private router: Router,
    private activateRouter: ActivatedRoute,
  ) { }

  async ngOnInit() {

    // alert('fds')
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    await new Promise(resolve => {
      this.activateRouter.params.subscribe((params: any) => {
        this.id = params.id;
        resolve(params.id);
      });
    });

    const requestObj = {
      token: this.id
    };
    this.loader.start();
    this.userService.verifyEmailAddress(this.constructor.name, moduleName.verifyEmailModule, requestObj).pipe(delay(2000))
      .subscribe((data) => {
        this.loader.stop();
        if (data) {
          this.isInvitedUserVerified = true;
          this.message = 'Your email is successfully verified !';
          this.authService.logout(); 
          sessionStorage.clear();
          localStorage.removeItem('currentUser');
          this.orgservice.removeControls();
          this.userService.getCurrentUser.unsubscribe();
          localStorage.clear();
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },1000);
        }
      }, error => {
        this.loader.stop();
//      this.isUserVarified = false;
        this.message = 'This link has been expired!';
        this.isInvitedUserVerified = false;
        setTimeout(()=>{
          this.router.navigate(['/login']);
        },1000);
        //this.router.navigate(['/verify-email/',this.id]);
      });
  }
  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    // element.style.margin = null;
    // element.classList.add('container');
    element.classList.add('site-content');
  }
}
