import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-organizationteam',
  templateUrl: './organizationteam.component.html',
  styleUrls: ['./organizationteam.component.scss']
})
export class OrganizationteamComponent implements OnInit {
  organizationID: any;
  organizationTeamMemberList: any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private companyService: CompanyService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID,'organizationID..');
    });
    this.loadCompanyTeamMembers();
  }

  backToOrganizationDetail() {
    this.router.navigate(['/organizationdetails', this.organizationID]);
  }

  loadCompanyTeamMembers() {
    const key = 'response';
    this.companyService.getCompanyTeamMembers().subscribe((data) => {
      this.organizationTeamMemberList = data[key];
    });
  }

}
