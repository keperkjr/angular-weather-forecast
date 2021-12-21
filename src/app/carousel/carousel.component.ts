import { Component, OnInit, ViewChild, ElementRef, ContentChild, TemplateRef, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
    @ContentChild(TemplateRef)
    tmpl!: TemplateRef<any>;
    
    @ViewChild('widgetsContent')
    widgetsContent!: ElementRef;

    @Input()
    data!: any[];

    constructor() { }

    ngOnInit(): void {
    }
    scrollLeft(){
        // this.widgetsContent.nativeElement.scrollLeft -= 150;
        this.widgetsContent.nativeElement.scrollLeft -= this.widgetsContent.nativeElement.scrollWidth; 
      }
    
      scrollRight(){
        // this.widgetsContent.nativeElement.scrollLeft += 150;
        this.widgetsContent.nativeElement.scrollLeft += this.widgetsContent.nativeElement.scrollWidth; 
      }    

}
