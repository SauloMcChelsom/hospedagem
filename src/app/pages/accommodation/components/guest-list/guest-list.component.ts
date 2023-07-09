import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Inventory } from '../../models/inventory';

@Component({
	selector: 'app-guest-list',
	templateUrl: './guest-list.component.html',
	styleUrls: ['./guest-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestListComponent {
	@Input() public UserList: Inventory[] = [];
}
