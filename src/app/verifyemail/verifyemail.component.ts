import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  public id: string;
  message: any;
  constructor( private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const requestObj = {
      token: this.id
    };
    this.userService.verifyEmailAddress(requestObj).subscribe((data) => this.message = data);
  }

}
