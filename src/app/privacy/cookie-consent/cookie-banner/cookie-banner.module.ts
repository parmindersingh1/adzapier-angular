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
import { SetupComponent } from './setup/setup.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
const path: Routes = [{
  path: '', component: CookieBannerComponent,
},
  { path: 'setup', component: SetupComponent}
];
@NgModule({
  declarations: [CookieBannerComponent, SetupComponent],
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
        SharedbootstrapModule
    ]
})
export class CookieBannerModule { }
