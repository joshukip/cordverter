import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpointUploaderComponent } from './addpoint-uploader.component';

describe('AddpointUploaderComponent', () => {
  let component: AddpointUploaderComponent;
  let fixture: ComponentFixture<AddpointUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpointUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpointUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
