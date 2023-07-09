import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Inventory } from '../../models/inventory';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

	public load:boolean = false

	public InventoryEvent:Inventory[] = []

	constructor() {}

	onInventoryOutput($event:Inventory[]){
		this.InventoryEvent = $event
	}

	onLoadOutput($event:boolean){
		this.load = $event
	}
}
