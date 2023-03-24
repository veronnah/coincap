import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener("window:scroll") onWindowScroll(): void {
    const scrollUp = document.querySelector('.scroll-top-circle');

    if(window.scrollY > 500) {
      scrollUp!.classList.add('scroll-shown');
    } else {
      scrollUp!.classList.remove('scroll-shown');
    }
  }


}
