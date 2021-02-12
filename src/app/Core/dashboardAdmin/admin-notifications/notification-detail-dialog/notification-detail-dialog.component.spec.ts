import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailDialogComponent } from './notification-detail-dialog.component';

describe('NotificationDetailDialogComponent', () => {
  let component: NotificationDetailDialogComponent;
  let fixture: ComponentFixture<NotificationDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
