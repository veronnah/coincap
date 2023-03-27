import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinPageComponent } from './coin-page.component';

describe('CoinPageComponent', () => {
  let component: CoinPageComponent;
  let fixture: ComponentFixture<CoinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
