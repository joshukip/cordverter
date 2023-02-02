import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfUnitsComponent } from './conf-units.component';

describe('ConfUnitsComponent', () => {
  let component: ConfUnitsComponent;
  let fixture: ComponentFixture<ConfUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
