import { Component, OnInit,NgModule } from '@angular/core';
import {FormGroup, Validators,FormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-orgpage',
  templateUrl: './orgpage.component.html',
  styleUrls: ['./orgpage.component.scss']
})
@NgModule({
  imports: [
FormsModule
  ]
 
})

export class OrgpageComponent implements OnInit {
  orgForm: FormGroup;
  show:boolean=true;
  show1:boolean=false;
  submitted: boolean;
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orgForm = this.formBuilder.group({
      fullName: ['', Validators.required,Validators.pattern]
    });
  }
  get f() { return this.orgForm.controls; }
  onSubmit(){
    //debugger;
    this.submitted = true;
    
  }
  editclick(){
    //debugger;
    this.show=false;
    this.show1=true;
    
  }

  cancelclick(){
    //debugger;
    this.show=true;
    this.show1=false;
  }

}
