import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BannerConfigComponent} from './banner-config.component';
import {SplitterModule} from 'primeng/splitter';
import {FeatherModule} from 'angular-feather';
import {CheckboxModule} from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ColorPickerModule} from 'primeng/colorpicker';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { AzBannerComponent } from './az-banner/az-banner.component';
import { AzPreferenceComponent } from './az-preference/az-preference.component';

const path: Routes = [{
  path: '', component: BannerConfigComponent
}];

@NgModule({
  declarations: [BannerConfigComponent, AzBannerComponent, AzPreferenceComponent],
  imports: [
    CommonModule,
    SplitterModule,
    InputSwitchModule,
    RouterModule.forChild(path),
    FeatherModule,
    DividerModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    MultiSelectModule,
    TableModule,
    RadioButtonModule,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    ColorPickerModule,
    DragDropModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
    ReactiveFormsModule
  ]
})
export class BannerConfigModule { }
