import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {CommonService} from '../../../core/services/common/common.service';

@Component({
  selector: 'slider-page',
  templateUrl: './slider-page.component.html',
  styleUrls: ['./slider-page.component.scss']
})
export class SliderPageComponent implements OnInit {

  currentSlide = 0;
  showContentInterval: any = null;
  thumbnailList: any = [];
  showFullSizePreview = false;

  @Input() autoPlay = true;
  @Input() autoPlayTime = 5000;
  @Input() thumbnailType: 'circle' | 'square' | 'none' = 'circle';
  @Input() imagesList: any = [];
  @Input() showHeader = true;
  @Input() showContent = false;
  @Input() showArrowAction = true;
  @Input() thumbnailDotText = false;
  @Input() showFullSizeBtn = true;
  @Input() thumbnailOverlap = true;
  @Input() customHeaderTemplate = false;

  @ContentChild('headerTemplate') headerTemplate: TemplateRef<any>;
  @ContentChild('contentTemplate') contentTemplate: TemplateRef<any>;

  @Output() currentSlideData = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.setAutoId();
    this.presentData();
  }

  setAutoId() {
    this.imagesList.map((x, index) => {
      x.mainIndexId = index;
      if (!x.hasOwnProperty('id')) {
        x.id = this.common.generateRandomString();
      }
    });
  }

  presentData() {
    this.makeThumbnailList();
    this.autoPlaySlides();
  }

  autoPlaySlides() {
    if (this.autoPlay) {
      this.showContentInterval = setInterval(() => {
        this.thumbnailList = [];
        this.currentSlide = this.currentSlide + 1 === this.imagesList.length ? 0 : this.currentSlide + 1;
        this.emitCurrentData();
        this.makeThumbnailList();
      }, this.autoPlayTime);
    } else {
      this.makeThumbnailList();
    }
  }

  clearAutoPlaySlides() {
    clearInterval(this.showContentInterval);
  }

  makeThumbnailList() {
    this.thumbnailList = [];
    if (this.currentSlide === 0) {
      this.thumbnailList.push(this.imagesList[this.imagesList.length - 2]);
      this.thumbnailList.push(this.imagesList[this.imagesList.length - 1]);
    } else if (this.currentSlide === 1) {
      this.thumbnailList.push(this.imagesList[this.imagesList.length - 1]);
      this.thumbnailList.push(this.imagesList[0]);
    } else {
      this.thumbnailList.push(this.imagesList[this.currentSlide - 2]);
      this.thumbnailList.push(this.imagesList[this.currentSlide - 1]);
    }
    this.thumbnailList.push(this.imagesList[this.currentSlide]);
    if (this.currentSlide + 2 <= this.imagesList.length - 1) {
      this.thumbnailList.push(this.imagesList[this.currentSlide + 1]);
      this.thumbnailList.push(this.imagesList[this.currentSlide + 2]);
    } else if (this.currentSlide + 1 <= this.imagesList.length - 1) {
      this.thumbnailList.push(this.imagesList[this.currentSlide + 1]);
    }
    if (this.thumbnailList.length < 5 && this.thumbnailList.length !== 4) {
      this.thumbnailList.push(this.imagesList[0]);
      this.thumbnailList.push(this.imagesList[1]);
    }
    if (this.thumbnailList.length === 4) {
      this.thumbnailList.push(this.imagesList[0]);
    }
    this.cdr.detectChanges();
  }

  showThisImage(id) {
    clearInterval(this.showContentInterval);
    this.currentSlide = id;
    this.emitCurrentData();
    this.showFullSizePreview ? this.makeThumbnailList() : this.presentData();
  }

  preSlide() {
    clearInterval(this.showContentInterval);
    this.currentSlide = this.currentSlide - 1 < 0 ? this.imagesList.length - 1 : this.currentSlide - 1;
    this.emitCurrentData();
    this.showFullSizePreview ? this.makeThumbnailList() : this.presentData();
  }

  nextSlide() {
    clearInterval(this.showContentInterval);
    this.currentSlide = this.currentSlide + 1 === this.imagesList.length ? 0 : this.currentSlide + 1;
    this.emitCurrentData();
    this.showFullSizePreview ? this.makeThumbnailList() : this.presentData();
  }

  emitCurrentData() {
    this.currentSlideData.emit({currentSlide: this.imagesList[this.currentSlide]});
  }

  showFullSizeImage() {
    clearInterval(this.showContentInterval);
    this.showFullSizePreview = true;
  }

  closeOverview() {
    this.showFullSizePreview = false;
    if (this.autoPlay) {
      this.presentData();
    }
  }

}
