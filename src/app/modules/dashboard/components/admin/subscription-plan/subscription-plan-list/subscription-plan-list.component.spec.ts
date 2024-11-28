import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanListComponent } from './subscription-plan-list.component';

describe('SubscriptionPlanListComponent', () => {
  let component: SubscriptionPlanListComponent;
  let fixture: ComponentFixture<SubscriptionPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
