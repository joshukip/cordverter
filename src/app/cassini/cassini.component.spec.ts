import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CassiniComponent } from './cassini.component';

describe('CassiniComponent', () => {
  let component: CassiniComponent;
  let fixture: ComponentFixture<CassiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CassiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CassiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
