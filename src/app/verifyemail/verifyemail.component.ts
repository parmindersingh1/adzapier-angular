import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services';
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  public id: string;
  message: any;
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
    this.userService.verifyEmailAddress(requestObj).subscribe((data) => {
      this.loading.stop();
      this.message = data;
      console.log('message' , this.message);
    }, error => {
      this.loading.stop();
    });
  }

}
