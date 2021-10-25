import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysqlFormComponent } from './mysql-form.component';

describe('MysqlFormComponent', () => {
  let component: MysqlFormComponent;
  let fixture: ComponentFixture<MysqlFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MysqlFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysqlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
