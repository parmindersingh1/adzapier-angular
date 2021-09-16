import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
  import { ManageLicenceComponent } from './manage-licence.component';
import {ButtonModule} from 'primeng/button';

const paths: Routes = [
  {path: '', component:ManageLicenceComponent },
  {path: 'organizations', loadChildren: () => import('./manage-organization/manage-organization.module').then(m => m.ManageOrganizationModule)},
  {path: 'property', loadChildren: () => import('./manage-property/manage-property.module').then(m => m.ManagePropertyModule)},

];
@NgModule({
  declarations: [ManageLicenceComponent],
    imports: [
        CommonModule,
        SharedbootstrapModule,
        RouterModule.forChild(paths),
        ButtonModule
    ]
})
export class ManageLicenceModule { }
