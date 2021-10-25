import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlQueryBuilderComponent } from './sql-query-builder.component';

describe('SqlQueryBuilderComponent', () => {
  let component: SqlQueryBuilderComponent;
  let fixture: ComponentFixture<SqlQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SqlQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
