import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from './../_services';


@Component({ 
  templateUrl: 'internalerror.component.html' ,
  
})
export class InternalerrorComponent implements OnInit {

    constructor() {}

    ngOnInit(){
        
    }

}

