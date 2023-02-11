import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSeparatorComponent } from './main-separator.component';

describe('MainSeparatorComponent', () => {
  let component: MainSeparatorComponent;
  let fixture: ComponentFixture<MainSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainSeparatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
