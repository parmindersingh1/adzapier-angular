import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentlegalTableComponent } from './consentlegal-table.component';

describe('ConsentlegalTableComponent', () => {
  let component: ConsentlegalTableComponent;
  let fixture: ComponentFixture<ConsentlegalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentlegalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentlegalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
