import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedNoteComponent } from './feed-note.component';

describe('FeedNoteComponent', () => {
  let component: FeedNoteComponent;
  let fixture: ComponentFixture<FeedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
