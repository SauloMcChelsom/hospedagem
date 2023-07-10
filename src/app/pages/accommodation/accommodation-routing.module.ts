import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GuestRegisterComponent } from './components/guest-register/guest-register.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AddNewReserveComponent } from './components/add-new-reserve/add-new-reserve.component';

const routes: Routes = [
    {
		path: '',
		component: HomeComponent,
	},
    {
		path: 'new-guest',
		component: GuestRegisterComponent,
	},
	{
		path: 'user-id/:id/add-new-reserve',
		component: AddNewReserveComponent,
	},
	{
		path: 'order/:id/detail',
		component: OrderDetailComponent,
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccommodationRoutingModule { }
