import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { ThankyoupageComponent } from './thankyoupage.component';


const routes: Routes = [{ path: '', component: RegisterComponent },{ path: 'thankyou', component: ThankyoupageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
