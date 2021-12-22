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

    @ViewChild('progress')
    progress!: ElementRef;

    @Input()
    data!: any[];

    percent: number = 0;
    scrollWidth: number = 150;
    progressLeft: number = 0;

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

        let newPercent = ((this.content.nativeElement.scrollLeft + adjustment) / (this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth));
        this.percent = Math.max(0, Math.min(newPercent, 1)) * 100;

        let left = newPercent * ((this.content.nativeElement.clientWidth - this.progress.nativeElement.clientWidth));
        
        console.log('left:', left, 'percent:', this.percent, 
            'this.content.nativeElement.clientWidth:', this.content.nativeElement.clientWidth,
            'this.progress.nativeElement.clientWidth:', this.progress.nativeElement.clientWidth);

        left = Math.max(0, Math.min(left, this.content.nativeElement.clientWidth - this.progress.nativeElement.clientWidth));
        this.progress.nativeElement.style.left = left + 'px';
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