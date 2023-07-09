import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GuestRegisterComponent } from './components/guest-register/guest-register.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';

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
		path: 'order/:id/detail',
		component: OrderDetailComponent,
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccommodationRoutingModule { }
