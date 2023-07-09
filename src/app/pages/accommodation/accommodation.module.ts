import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../shared/theme/angular-material.module';

import { AccommodationRoutingModule } from './accommodation-routing.module';
import { HomeComponent } from './components/home/home.component';
import { GuestListComponent } from './components/guest-list/guest-list.component';
import { GuestFilterComponent } from './components/guest-filter/guest-filter.component';
import { GuestRegisterComponent } from './components/guest-register/guest-register.component';
import {MatChipsModule} from '@angular/material/chips';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { NgxMaskModule } from 'ngx-mask'

@NgModule({
  declarations: [
    HomeComponent,
    GuestListComponent,
    GuestFilterComponent,
    GuestRegisterComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    AccommodationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgxMaskModule.forChild(),
  ]
})
export class AccommodationModule { }
