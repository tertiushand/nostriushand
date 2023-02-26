import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBreakComponent } from './feed-break.component';

describe('FeedBreakComponent', () => {
  let component: FeedBreakComponent;
  let fixture: ComponentFixture<FeedBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedBreakComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
