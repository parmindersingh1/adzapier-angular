import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateworkflowComponent } from './createworkflow.component';

describe('CreateworkflowComponent', () => {
  let component: CreateworkflowComponent;
  let fixture: ComponentFixture<CreateworkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateworkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateworkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
