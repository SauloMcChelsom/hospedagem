import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './notfound.component';
import { PageNotFoundRoute } from './notfound.route';
import { AngularMaterialModule } from '../../shared/theme/angular-material.module';

@NgModule({
	imports: [CommonModule, AngularMaterialModule],
	declarations: [PageNotFoundComponent],
	exports: [PageNotFoundComponent, PageNotFoundRoute],
})
export class PageNotFoundModule {}
