import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinListTableComponent } from './coin-list-table.component';

describe('CoinListTableComponent', () => {
  let component: CoinListTableComponent;
  let fixture: ComponentFixture<CoinListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
