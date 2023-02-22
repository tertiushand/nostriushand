import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteReactionComponent } from './note-reaction.component';

describe('NoteReactionComponent', () => {
  let component: NoteReactionComponent;
  let fixture: ComponentFixture<NoteReactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteReactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
