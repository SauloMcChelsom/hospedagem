import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccommodationRoutingModule } from './accommodation-routing.module';
import { AccommodationComponent } from './accommodation.component';


@NgModule({
  declarations: [
    AccommodationComponent
  ],
  imports: [
    CommonModule,
    AccommodationRoutingModule
  ]
})
export class AccommodationModule { }
