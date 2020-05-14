import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermofuseComponent } from './termofuse.component';

describe('TermofuseComponent', () => {
  let component: TermofuseComponent;
  let fixture: ComponentFixture<TermofuseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermofuseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermofuseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
