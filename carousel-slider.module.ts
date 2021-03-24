import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselPageComponent } from './carousel-page/carousel-page.component';
import { SliderPageComponent } from './slider-page/slider-page.component';



@NgModule({
  declarations: [CarouselPageComponent, SliderPageComponent],
  exports: [CarouselPageComponent, SliderPageComponent],
  imports: [
    CommonModule,
  ]
})
export class CarouselSlidersModule { }
