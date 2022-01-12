import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentTableComponent} from './consent-table/consent-table.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConsentDetailsComponent} from './consent-table/consent-details/consent-details.component';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabViewModule} from 'primeng/tabview';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConsentSetupComponent } from './consent-setup/consent-setup.component';
import { NewsletterConfigComponent } from './newsletter-config/newsletter-config.component';
import {SplitterModule} from 'primeng/splitter';
import {DividerModule} from 'primeng/divider';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ColorPickerModule} from 'primeng/colorpicker';
import { NewsletterPreviewComponent } from './newsletter-config/newsletter-preview/newsletter-preview.component';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputNumberModule} from 'primeng/inputnumber';




const path: Routes = [
  {path: 'consent-records', component: ConsentTableComponent},
  {path: 'consent-records/details/:id', component: ConsentDetailsComponent},
  {path: 'subscription-consent-banner-configuration', component: NewsletterConfigComponent},
  {path: 'setup', component: ConsentSetupComponent}
];

@NgModule({
  declarations: [ConsentTableComponent, ConsentDetailsComponent, ConsentSetupComponent, NewsletterConfigComponent, NewsletterPreviewComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(path),
        TabsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        SharedbootstrapModule,
        RadioButtonModule,
        TabViewModule,
        ModalModule,
        SplitterModule,
        DividerModule,
        CheckboxModule,
        DropdownModule,
        InputTextareaModule,
        ColorPickerModule,
        RippleModule,
        ScrollPanelModule,
        InputSwitchModule,
        InputNumberModule
    ]
})
export class ConsentSolutionsModule {
}
