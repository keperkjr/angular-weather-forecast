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
        this.addTouchScroll();
    }

    scrollLeft() {
        this.adjustScrollPosition(-this.scrollWidth);
    }

    scrollRight() {
        this.adjustScrollPosition(this.scrollWidth);
    } 
    
    adjustScrollPosition(adjustment: number) {
        this.content.nativeElement.scrollLeft += adjustment;

        let newPercent = 100 * ((this.content.nativeElement.scrollLeft + adjustment) / (this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth));
        this.percent = Math.max(0, Math.min(newPercent, 100));
    }

    // Horizontal touch scroll
    addTouchScroll() {
        let startPos = 0;
        let element = this.content.nativeElement;

        element.addEventListener("touchstart", (event: any) => {
            startPos = event.touches[0].pageX;
        });

        element.addEventListener("touchmove", (event: any) => {
            let adjustment = startPos - event.touches[0].pageX;
            // If 'adjustment' is positive, user made a movement the right direction
            // else user made a movement in the left direction
            this.adjustScrollPosition(adjustment);              
        });
    }   
}