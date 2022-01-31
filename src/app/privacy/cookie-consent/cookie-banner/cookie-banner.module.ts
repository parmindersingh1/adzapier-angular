import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieBannerComponent} from './cookie-banner.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {SetupComponent} from './setup/setup.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TabViewModule} from 'primeng/tabview';
import { BannerLivePriviewComponent } from './banner-live-priview/banner-live-priview.component';
import {AccordionModule} from 'primeng/accordion';
import { PopupLivePreviewComponent } from './popup-live-preview/popup-live-preview.component';
import {CheckboxModule} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';
import {HasUnsavedDataGuard} from '../../../_helpers/formUnsaved.guard';

const path: Routes = [{
  path: '', component: CookieBannerComponent, canDeactivate: [HasUnsavedDataGuard]
},
  { path: 'setup', component: SetupComponent}
];
@NgModule({
  declarations: [CookieBannerComponent, SetupComponent, BannerLivePriviewComponent, PopupLivePreviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    ReactiveFormsModule,
    SharedbootstrapModule,
    FormsModule,
    TabsModule,
    TabViewModule,
    AccordionModule,
    CheckboxModule,
    MultiSelectModule,
    TableModule,
    RadioButtonModule,
    // TabsModule
  ],
  providers: [HasUnsavedDataGuard]
})
export class CookieBannerModule { }
