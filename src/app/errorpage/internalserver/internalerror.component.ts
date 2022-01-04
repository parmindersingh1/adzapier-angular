import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-internalerror',
  templateUrl: './internalerror.component.html',
  styleUrls: ['./internalerror.component.scss']
})
export class InternalerrorComponent implements OnInit {
  queryOID;
  queryPID;
  constructor(private location:Location, private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
 this.activateRoute.queryParamMap
 .subscribe(params => {
   this.queryOID = params.get('oid');
   this.queryPID = params.get('pid');

   
//   this.updatedUrlWithPID = params.get('pid');  
// console.log(params.get('oid'),'oid..');
// console.log(params.get('pid'),'pid..');
});
  }

  gotoPreviousLink(){
    this.router.navigate([this.location.back()],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }
}
