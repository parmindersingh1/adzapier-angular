import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OrganizationService } from '../_services';

import { AnalyticsComponent } from './analytics.component';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let orgService: OrganizationService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[RouterModule.forRoot([]),HttpClientModule],
      declarations: [ AnalyticsComponent ],
      providers:[{provide:OrganizationService,useClass:OrganizationServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    orgService = TestBed.inject(OrganizationService);
    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain app details',() =>{
    expect(component.appsContent).not.toEqual(null);
  })

  it('should contain organizationid and propertyid',() => {
    expect(component.queryOID).toBeDefined();
    expect(component.queryPID).toBeDefined();
  })

  it('initial number of license purchased is zero',() =>{
    expect(component.noOfLicensePurchased).toBe(0);
  })

  it('number of license purchased less than equal to 5',() =>{
    expect(component.noOfLicensePurchased).toBeLessThanOrEqual(5);
  })

  it('Expect service to return current property',() =>{
    component.ngOnInit();
    orgService.currentPropertySource.next('alphabets');
  })
   
});

export class OrganizationServiceStub {
  public currentPropertySource = new BehaviorSubject<any>('');
    currentProperty = this.currentPropertySource.asObservable();
}