import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { InternalerrorComponent } from './internalserver/internalerror.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
    { path: '', component: InternalerrorComponent},
    {
      path: 'pagenotfound',
      children: [
      {path:'',component: PagenotfoundComponent}
      ]
    },
    {
    path:'servererror',
    children:[{path:'',component:InternalerrorComponent}]
    },
    {
      path:'unauthorized',
      children:[{path:'',component:UnauthorizedComponent}]
    },
    {
      path:'forbidden',
      children:[{path:'',component:ForbiddenComponent}]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorpageRoutingModule { }