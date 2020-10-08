import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService, OrganizationService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';

@Component({
  selector: 'app-organizationteam',
  templateUrl: './organizationteam.component.html',
  styleUrls: ['./organizationteam.component.scss']
})
export class OrganizationteamComponent implements OnInit {
  inviteUserOrgForm: FormGroup;
  organizationID: any;
  organizationTeamMemberList: any = [];
  roleList: any;
  submitted;
  emailid;
  p: number = 1;
  pageSize: any = 5;
  totalCount: any;
  searchText: any;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private orgService: OrganizationService,
              private loading: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID, 'organizationID..');
      this.loadOrgTeamMembers(this.organizationID);
    });
    this.loadRoleList();
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required]],
      permissions: ['', [Validators.required]],
    });
  }
  get f() { return this.inviteUserOrgForm.controls; }
  backToOrganizationDetail() {
    this.router.navigate(['settings/organizations/organizationdetails', this.organizationID]);
  }

  loadOrgTeamMembers(orgID) {
    const key = 'response';
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    console.log('page Limit', pagelimit);
    this.orgService.getOrgTeamMembers(orgID, pagelimit).subscribe((data) => {
      this.loading.stop();
      this.organizationTeamMemberList = data.response;
      this.paginationConfig.totalItems = data.count;
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
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    const key = 'response';
    this.loading.start();
    this.orgService.getOrgTeamMembers(this.organizationID, pagelimit).subscribe((data) => {
      this.loading.stop();
      this.organizationTeamMemberList = data.response;
      this.paginationConfig.totalItems = data.count;
    },(error)=>{
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
      this.modalService.dismissAll('Error!');
    });
  }


  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
  }



  onSubmitInviteUserOrganization() {
    this.submitted = true;
    if (this.inviteUserOrgForm.invalid) {
      return false;
    } else {
      const requestObj = {
        email: this.inviteUserOrgForm.value.emailid,
        role_id: this.inviteUserOrgForm.value.permissions,
        orgid: this.organizationID,
        user_level: 'organization'
      };
      this.loading.start();
      this.companyService.inviteUser(requestObj)
        .subscribe((data) => {
          this.loading.stop();
          if (data) {
            this.alertMsg = 'We have sent a email on your Email Id';
            this.isOpen = true;
            this.alertType = 'success';
            this.loadOrgTeamMembers(this.organizationID);
            this.onCancelClick();
          }
        }, (error) => {
          this.loading.stop();
          this.alertMsg = error.Taken_email || error;
          this.isOpen = true;
          this.alertType = 'danger';
          this.onCancelClick();
        });
    }
  }
  onResendInvitation(email) {
    const requestObj = {
      email,
      orgid: this.organizationID,
      user_level: 'organization'
    };
    this.companyService.inviteUser(requestObj)
      .subscribe((data) => {
        if (data) {
          this.alertMsg = 'We have sent a email on your Email Id';
          this.isOpen = true;
          this.alertType = 'success';
          this.loadOrgTeamMembers(this.organizationID);
          this.inviteUserOrgForm.reset();
          this.modalService.dismissAll('Data Saved!');
        }
      }, (error) => {
        this.alertMsg = JSON.stringify(error);
        this.isOpen = true;
        this.alertType = 'danger';
        this.modalService.dismissAll('Error!');
      });
  }

  removeTeamMember(id) {
    this.loading.start();
    this.companyService.removeTeamMember(id).subscribe((data) => {
      this.loading.stop();
      if (data) {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadOrgTeamMembers(this.organizationID);
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'dangere';
    });
  }

  onCancelClick() {
    this.submitted = false;
    this.inviteUserOrgForm.reset();
    this.modalService.dismissAll('Canceled');
  }

}
