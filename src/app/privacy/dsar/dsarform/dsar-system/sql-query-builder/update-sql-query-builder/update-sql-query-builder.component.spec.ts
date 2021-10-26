import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSqlQueryBuilderComponent } from './update-sql-query-builder.component';

describe('UpdateSqlQueryBuilderComponent', () => {
  let component: UpdateSqlQueryBuilderComponent;
  let fixture: ComponentFixture<UpdateSqlQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSqlQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSqlQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
