import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRestApiComponent } from './update-rest-api.component';

describe('UpdateRestApiComponent', () => {
  let component: UpdateRestApiComponent;
  let fixture: ComponentFixture<UpdateRestApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRestApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRestApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
