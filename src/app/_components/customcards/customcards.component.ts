import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';

@Component({
  selector: 'app-customcards',
  templateUrl: './customcards.component.html',
  styleUrls: ['./customcards.component.scss']
})
export class CustomcardsComponent implements OnInit {
  @Input() dataList : any;
  @Output() onClickViewForm : EventEmitter<any> = new EventEmitter<any>();
  constructor(private ccpaFormConfigService:CCPAFormConfigurationService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  showForm(data) {
    this.onClickViewForm.emit(data);
  }

}
