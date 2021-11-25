import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetPlaneComponent } from './planet-plane.component';

describe('PlanetPlaneComponent', () => {
  let component: PlanetPlaneComponent;
  let fixture: ComponentFixture<PlanetPlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanetPlaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
