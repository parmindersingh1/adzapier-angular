import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieBannerComponent} from './cookie-banner.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {SetupComponent} from './setup/setup.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TabViewModule} from 'primeng/tabview';
import { BannerLivePriviewComponent } from './banner-live-priview/banner-live-priview.component';
import {AccordionModule} from 'primeng/accordion';
import { PopupLivePreviewComponent } from './popup-live-preview/popup-live-preview.component';
import {CheckboxModule} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';
const path: Routes = [{
  path: '', component: CookieBannerComponent,
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
    TabsModule,
    TabViewModule,
    AccordionModule,
    CheckboxModule,
    MultiSelectModule,
    // TabsModule
  ]
})
export class CookieBannerModule { }
