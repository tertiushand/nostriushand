import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFeedComponent } from './note-feed.component';

describe('NoteFeedComponent', () => {
  let component: NoteFeedComponent;
  let fixture: ComponentFixture<NoteFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
