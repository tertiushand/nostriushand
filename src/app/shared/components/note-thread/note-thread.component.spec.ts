import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteThreadComponent } from './note-thread.component';

describe('NoteThreadComponent', () => {
  let component: NoteThreadComponent;
  let fixture: ComponentFixture<NoteThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteThreadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
