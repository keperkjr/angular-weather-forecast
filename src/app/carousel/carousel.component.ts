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
        // Total width
        console.log('content.nativeElement.scrollWidth', this.content.nativeElement.scrollWidth);
        console.log('content.nativeElement.scrollLeft', this.content.nativeElement.scrollLeft);
        console.log('content.nativeElement.offsetWidth', this.content.nativeElement.offsetWidth);

        // this.initialPosition = this.content.nativeElement.offsetWidth;
        // this.endPosition = this.content.nativeElement.scrollWidth;

        this.scrollPercent();
    }

    scrollLeft() {
        this.content.nativeElement.scrollLeft -= this.scrollWidth;
        this.scrollPercent();
    }

    scrollRight() {
        this.content.nativeElement.scrollLeft += this.scrollWidth;
        this.scrollPercent()
    } 
    
    scrollPercent() {
        setTimeout(() => {
            console.log('content.nativeElement.scrollLeft', this.content.nativeElement.scrollLeft);

            this.percent = 100 * (this.content.nativeElement.scrollLeft / (this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth));
            console.log(this.percent);
        }, 500);
    }
}
