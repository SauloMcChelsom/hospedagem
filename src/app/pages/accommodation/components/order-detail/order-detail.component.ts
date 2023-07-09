import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
	constructor() {}
}
