import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditwebformComponent } from './editwebform.component';

describe('EditwebformComponent', () => {
  let component: EditwebformComponent;
  let fixture: ComponentFixture<EditwebformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditwebformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditwebformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
