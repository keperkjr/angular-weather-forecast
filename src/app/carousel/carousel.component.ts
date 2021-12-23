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

    @Input()
    buttonScrollWidth: number = 150;

    progressBarWidth: number = 0;
    progressScrollLeft: number = 0;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.adjustScrollPosition(0);
        this.addTouchScroll();

        window.addEventListener('resize', () => {
            this.adjustScrollPosition(0);
        });
    }

    scrollLeft() {
        this.adjustScrollPosition(-this.buttonScrollWidth);
    }

    scrollRight() {
        this.adjustScrollPosition(this.buttonScrollWidth);
    } 
    
    adjustScrollPosition(adjustment: number) {
        this.content.nativeElement.scrollLeft += adjustment;

        let scrollPercentCompleted = (this.content.nativeElement.scrollLeft + adjustment) / (this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth);
        this.progressBarWidth = Math.max(0, Math.min(scrollPercentCompleted, 1)) * 100;

        let progressScrollLeftEndPos = this.content.nativeElement.clientWidth - this.progress.nativeElement.clientWidth;
        let newProgressScrollLeft = scrollPercentCompleted * progressScrollLeftEndPos;        
        this.progressScrollLeft = Math.max(0, Math.min(newProgressScrollLeft, progressScrollLeftEndPos));
    }

    // Horizontal touch scroll
    addTouchScroll() {
        let startPos = 0;
        let element = this.content.nativeElement;

        element.addEventListener('touchstart', (event: any) => {
            startPos = event.touches[0].pageX;
        });

        element.addEventListener('touchmove', (event: any) => {
            let adjustment = startPos - event.touches[0].pageX;
            // If 'adjustment' is positive, user made a movement the right direction
            // else user made a movement in the left direction
            this.adjustScrollPosition(adjustment);              
        });
    }   
}