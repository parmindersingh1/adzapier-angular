import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { CompanyteamComponent } from './companyteam.component';
import { CompanyTeamRoutingModule } from './companyteam-routing.module';
// import { CompanyteamComponent } from './companyteam.component';
// import { CompanyTeamRoutingModule } from './companyteam-routing.module';


@NgModule({
  declarations: [ CompanyteamComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedbootstrapModule,
    CompanyTeamRoutingModule
  ]
})
export class CompanyTeamModule { }
