import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../_services';
import { FormArray, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-organizationteam',
  templateUrl: './organizationteam.component.html',
  styleUrls: ['./organizationteam.component.scss']
})
export class OrganizationteamComponent implements OnInit {
  inviteUserOrgForm: FormGroup;
  organizationID: any;
  organizationTeamMemberList: any;
  roleList: any;
  submitted;
  emailid;
  p: number = 1;
  pageSize: any = 2;
  totalCount: any;
  searchText: any;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private loading: NgxUiLoaderService,
              private companyService: CompanyService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID,'organizationID..');
    });
    this.loadRoleList();
    this.loadCompanyTeamMembers();
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required]],
      permissions: new FormArray([])
    });
  }
  get f() { return this.inviteUserOrgForm.controls; }
  backToOrganizationDetail() {
    this.router.navigate(['/organizationdetails', this.organizationID]);
  }

  loadCompanyTeamMembers() {
    const key = 'response';
    this.loading.start();
    this.companyService.getCompanyTeamMembers().subscribe((data) => {
      this.organizationTeamMemberList = data[key];
    });
  }

  loadRoleList() {
    this.loading.start();
    this.userService.getRoleList().subscribe((data) => {
      this.loading.stop();
      if (data) {
        const key = 'response';
        // const roleid = data[key];
        this.roleList = data[key];
      }
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    const key = 'response';
    this.loading.start();
    this.companyService.getCompanyTeamMembers().subscribe((data) => {
      this.loading.stop();
      this.organizationTeamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.organizationTeamMemberList;
    });
  }


	onChangeEvent(event) {
		this.paginationConfig.itemsPerPage = Number(event.target.value);
  }

  onCheckChange(event) {
    const formArray: FormArray = this.inviteUserOrgForm.get('permissions') as FormArray;
    const index = formArray.value.indexOf(event.target.value);
    if (index === -1) {
      formArray.push(new FormControl(event.target.value));
    } else {
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          formArray.removeAt(index);
          return;
        }
      });
    }
    console.log(formArray.value, 'fcv..');
  }

  onSubmitInviteUserOrganization() {
    this.submitted = true;
    if (this.inviteUserOrgForm.invalid) {
      return false;
    } else {
      const requestObj = {
        email: this.inviteUserOrgForm.value.emailid,
        role_id: this.inviteUserOrgForm.value.permissions[0],
        orgid: this.organizationID,
        user_level: 'organization'
      };
      this.loading.start();
      this.companyService.inviteUser(requestObj)
        .subscribe((data) => {
          this.loading.stop();
          if (data) {
            alert('Details has been updated successfully!');
            this.loadCompanyTeamMembers();
            this.modalService.dismissAll('Data Saved!');
          }
        }, (error) => {
          this.loading.stop();
          alert(error);
          this.modalService.dismissAll('Error!');
        });
    }
  }

  removeTeamMember(id) {
   this.loading.start();
   this.companyService.removeTeamMember(id).subscribe((data)=>{
     this.loading.stop();
     if (data) {
       alert('User has been removed.');
       this.loadCompanyTeamMembers();
     }
   }, (err) => {
     alert(JSON.stringify(err));
   });
  }
}
