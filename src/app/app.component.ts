import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { HeaderComponent } from './_components/layout/header/header.component';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(HeaderComponent, {static: false}) headerComponent: HeaderComponent;
  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  constructor() {
  //  this.headerComponent.loadOrganizationList();
  }

  // ngAfterViewInit(){
  //   this.headerComponent.loadOrganizationList();
  // }
}
