import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieBannerComponent} from './cookie-banner.component';
import {RouterModule, Routes} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {SetupComponent} from './setup/setup.component';
import {TabsModule} from 'ngx-bootstrap';
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
    MatSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
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
