import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
	{
		path: '', redirectTo: '/accommodation', pathMatch: 'full'
	},
	{
		path: 'accommodation',
		loadChildren: () => import('./pages/accommodation/accommodation.module').then(m => m.AccommodationModule),
	},
    {
		path: 'page-not-found',
		loadChildren: () => import('./pages/not-found/notfound.module').then(m => m.PageNotFoundModule),
	},
	{
		path: '**',
		redirectTo: 'page-not-found',
	},
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
