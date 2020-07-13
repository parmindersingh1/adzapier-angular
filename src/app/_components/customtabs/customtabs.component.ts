import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customtabs',
  templateUrl: './customtabs.component.html',
  styleUrls: ['./customtabs.component.scss']
})
export class CustomtabsComponent implements OnInit {
  @Input() inputData: any = [];
  @Input() currentTab: any;
  @Output() currentStageEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('panel', { static: true }) public panel: ElementRef<any>;
  newitemAdded: any = [];
  currentStage: any;
  stage_title: any;
  largest_id: any;
  constructor() { }

  ngOnInit() {
  }

  addCustomStages(index, itemorder) {
    const orderIdExist = this.inputData.filter((t) => t.order === itemorder + 1).length > 0;
    if (orderIdExist) {
      let idx = this.inputData.findIndex((t) => t.order === itemorder + 1)
      this.inputData[idx].order = idx + 2;
    }

    const customStageObj = {
      guidance_text: 'Add your guidance text ',
      id:'', // this.generateUUID(),
      order: itemorder + 1,
      stage_title: this.stage_title || 'New stage'
    };


    let start = index + 1;
    let deleteCount = 0;
    this.newitemAdded.push(customStageObj);
    this.inputData.splice(start, deleteCount, customStageObj);
    this.currentStageEvent.emit(customStageObj);
    this.updateOrders(this.inputData);
    this.currentTab  = this.inputData[customStageObj.order - 1].order;
    if(this.newitemAdded.length >= 12){
      alert('You have reach limit of 12 stages!');
      return false;
    }
  }


  selectCurrentStage(item) {
    this.currentTab = item.order;
    this.currentStageEvent.emit(item);
  }

  deleteSelectedStage(index) {
    this.inputData.splice(index, 1);
    this.updateOrders(this.inputData);
  }

  public onPreviousSearchPosition(): void {
    this.panel.nativeElement.scrollLeft -= 150;
  }

  public onNextSearchPosition(): void {
    this.panel.nativeElement.scrollLeft += 150;
  }

  generateUUID() {
    let dt = new Date().getTime();
    const custUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return custUuid;
  }

  isOrderIDExist(id): boolean {
    return this.inputData.some((t) => t.order === id);
  }

  updateOrders(arrayData) {
    for (let k = 0; k < arrayData.length; k++) {
      if (arrayData[k].order !== k + 1) {
        arrayData[k].order = k + 1;
      }
    }
  }

  currentSelectedStage(id): boolean{
   return this.newitemAdded.filter((t) => t.order == id).length > 0;
  }

}
