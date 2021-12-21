import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    @ViewChild('widgetsContent')
    widgetsContent!: ElementRef;

    scrollLeft(){
        this.widgetsContent.nativeElement.scrollLeft -= 150;
        // this.widgetsContent.nativeElement.scrollLeft -= this.widgetsContent.nativeElement.scrollWidth; 
      }
    
      scrollRight(){
        this.widgetsContent.nativeElement.scrollLeft += 150;
        // this.widgetsContent.nativeElement.scrollLeft += this.widgetsContent.nativeElement.scrollWidth; 
      }    

}
