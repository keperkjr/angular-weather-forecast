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

    percent: number = 0;
    scrollWidth: number = 150;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.adjustScrollPosition(0);
    }

    scrollLeft() {
        this.adjustScrollPosition(-this.scrollWidth);
        
    }

    scrollRight() {
        this.adjustScrollPosition(this.scrollWidth);
    } 
    
    adjustScrollPosition(increment: number) {
        this.content.nativeElement.scrollLeft += increment;

        let newPercent = 100 * ((this.content.nativeElement.scrollLeft + increment) / (this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth));
        this.percent = Math.max(0, Math.min(newPercent, 100));
    }
}
