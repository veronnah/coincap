import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Output() getData: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  public paginate(direction: string): void {
    if (direction === 'next') {
      this.currentPage++
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }

    // this.getCoins(this.currentPage);
    this.getData.emit(this.currentPage);
  }

}
