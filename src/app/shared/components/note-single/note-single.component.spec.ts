import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSingleComponent } from './note-single.component';

describe('NoteSingleComponent', () => {
  let component: NoteSingleComponent;
  let fixture: ComponentFixture<NoteSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
