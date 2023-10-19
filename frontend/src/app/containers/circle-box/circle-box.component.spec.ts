import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleBoxComponent } from './circle-box.component';

describe('CircleBoxComponent', () => {
  let component: CircleBoxComponent;
  let fixture: ComponentFixture<CircleBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CircleBoxComponent]
    });
    fixture = TestBed.createComponent(CircleBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
