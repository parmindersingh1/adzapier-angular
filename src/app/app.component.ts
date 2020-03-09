import { Component } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from './_services';
import { User } from './_models';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  constructor() {
  }
}
