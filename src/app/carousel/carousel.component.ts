import { Component, OnInit, ViewChild, ElementRef, ContentChild, TemplateRef, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
    @ContentChild(TemplateRef)
    tmpl!: TemplateRef<any>;
    
    @ViewChild('content')
    content!: ElementRef;

    @Input()
    data!: any[];

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        // Total width
        // console.log(this.content.nativeElement.scrollWidth);
    }

    scrollLeft() {
        this.content.nativeElement.scrollLeft -= 150;
      }
    
      scrollRight() {
        this.content.nativeElement.scrollLeft += 150;
      }    

}
