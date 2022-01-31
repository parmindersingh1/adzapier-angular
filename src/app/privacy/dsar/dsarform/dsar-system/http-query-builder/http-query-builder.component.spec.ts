import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpQueryBuilderComponent } from './http-query-builder.component';

describe('HttpQueryBuilderComponent', () => {
  let component: HttpQueryBuilderComponent;
  let fixture: ComponentFixture<HttpQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
