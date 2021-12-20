import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConnectionFormComponent } from './update-connection-form.component';

describe('UpdateConnectionFormComponent', () => {
  let component: UpdateConnectionFormComponent;
  let fixture: ComponentFixture<UpdateConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConnectionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
