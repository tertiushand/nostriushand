import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightFadeContainerComponent } from './light-fade-container.component';

describe('LightFadeContainerComponent', () => {
  let component: LightFadeContainerComponent;
  let fixture: ComponentFixture<LightFadeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightFadeContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightFadeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
