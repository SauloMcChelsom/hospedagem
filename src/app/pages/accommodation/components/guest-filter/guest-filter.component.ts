import { ChangeDetectionStrategy, Component, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, concat, concatMap, empty, forkJoin, from, map, switchMap, takeUntil, tap, toArray } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AccommodationApiService } from '../../services/api/accommodation-api.service';
import { User } from '../../models/user';
import { OpenSnackBarService } from 'src/app/shared/services/open_snack_bar.service';
import { Inventory } from '../../models/inventory';
import { Order } from '../../models/order';

@Component({
	selector: 'app-guest-filter',
	templateUrl: './guest-filter.component.html',
	styleUrls: ['./guest-filter.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestFilterComponent {

	public mask_costomes:string = ''

	public type_search:string = 'name'

	public label_search:string = 'search by name'

	public formGroup: FormGroup = new FormGroup({
		search: new FormControl([{ disabled: true }])
	});

	public get search(): FormControl {
		return this.formGroup.get('search') as FormControl;
	}

	@ViewChild('focusElement') searchElement:any = null;

	private unsubscribe$ = new Subject();

	@Output() InventoryOutput: EventEmitter<Inventory[]> = new EventEmitter();

	@Output() LoadOutput: EventEmitter<boolean> = new EventEmitter(false);

	private INVENTORY_LIST:Inventory[] = []

	constructor(private _snackBar: OpenSnackBarService, private cd: ChangeDetectorRef, private service:AccommodationApiService) {}


	ngOnInit(){
		this.feed()
	}


	ngAfterViewInit() {
		this.searchElement.nativeElement.focus();
	}

	searchByName(){
		this.type_search = 'name'
		this.label_search = 'search by name'
		this.search.reset()
		this.mask_costomes = ''
		this.search.enable();
		this.searchElement.nativeElement.focus();
	}

	searchByCPF(){
		this.type_search = 'cpf'
		this.label_search = 'search by cpf'
		this.search.reset()
		this.mask_costomes = '000.000.000-00'
		this.search.enable();
		this.searchElement.nativeElement.focus();
	}

	searchByPhone(){
		this.type_search = 'phone'
		this.label_search = 'search by phone'
		this.search.reset()
		this.mask_costomes = '(00) 0000-0000'
		this.search.enable();
		this.searchElement.nativeElement.focus();
	}

	searchByGuest(){
		this.type_search = 'guest'
		this.label_search = 'Guests who are still in the hotel'
		this.search.reset()
		this.mask_costomes = ''
		this.search.disable();
		this.getUserByOderGuest()
	}

	searchByGuestNotCheckIn(){
		this.type_search = 'guest_not_check_in'
		this.label_search = 'Guests who have not yet checked in'
		this.search.reset()
		this.mask_costomes = ''
		this.search.disable();
		this.getUserByOderGuestNotCheckIn()
	}

	private getUserByOderGuestNotCheckIn(){
		this.LoadOutput.emit(true)
		this.INVENTORY_LIST = []
		this.service
			.getUserByOderGuestNotCheckIn()
			.pipe(
				switchMap(items => from(items).pipe(
					concatMap(order=>{
						return this.service.getUserById(order.user_id).pipe(
							map((user:User[]) => [{user:user[0], order:[order] || []}])
						);
					})
				)),
			).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				let inventory:Inventory = {
					user:items[0].user,
					order:items[0].order,
					id_order_recently:0
				}
				let order = this.currentDate(inventory)
				inventory.id_order_recently = order.length > 0 ? order[0].id : 0
				this.INVENTORY_LIST.push(inventory)
				this.INVENTORY_LIST = JSON.parse(JSON.stringify(this.INVENTORY_LIST))
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
			error:(error)=>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
		});
	}

	private getUserByOderGuest(){
		this.LoadOutput.emit(true)
		this.INVENTORY_LIST = []
		this.service
			.getUserByOderGuest()
			.pipe(
				switchMap(items => from(items).pipe(
					concatMap(order=>{
						return this.service.getUserById(order.user_id).pipe(
							map((user:User[]) => [{user:user[0], order:[order] || []}])
						);
					})
				)),
			).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				let inventory:Inventory = {
					user:items[0].user,
					order:items[0].order,
					id_order_recently:0
				}
				let order = this.currentDate(inventory)
				inventory.id_order_recently = order.length > 0 ? order[0].id : 0
				this.INVENTORY_LIST.push(inventory)
				this.INVENTORY_LIST = JSON.parse(JSON.stringify(this.INVENTORY_LIST))
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
			error:(error)=>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
		});
	}

	private getUserByName(value:string){
		this.LoadOutput.emit(true)
		this.INVENTORY_LIST = []
		this.service
			.getUserByName(value)
			.pipe(
				tap(r=>r.length == 0 ? this.INVENTORY_LIST = [] : null),
				switchMap(items => from(items).pipe(
					concatMap(user=>{
						return this.service.getOrderByUserId(user.id || 0).pipe(
							map(order => [{user:user, order:order || []}])
						);
					})
				)),
			).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				let inventory:Inventory = {
					user:items[0].user,
					order:items[0].order,
					id_order_recently:0
				}
				let order = this.currentDate(inventory)
				inventory.id_order_recently = order.length > 0 ? order[0].id : 0
				this.INVENTORY_LIST.push(inventory)
				this.INVENTORY_LIST = JSON.parse(JSON.stringify(this.INVENTORY_LIST))
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
			error:(error)=>{
				this.LoadOutput.emit(false)
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
		});
	}

	private getUserByCPF(value:string){
		this.INVENTORY_LIST = []
		this.LoadOutput.emit(true)
		this.service
			.getUserByCPF(value)
			.pipe(
				tap(r=>r.length == 0 ? this.INVENTORY_LIST = [] : null),
				switchMap(items => from(items).pipe(
					concatMap(user=>{
						return this.service.getOrderByUserId(user.id || 0).pipe(
							map(order => [{user:user, order:order || []}])
						);
					})
				)),
			).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				let inventory:Inventory = {
					user:items[0].user,
					order:items[0].order,
					id_order_recently:0
				}
				
				let order = this.currentDate(inventory)
				inventory.id_order_recently = order.length > 0 ? order[0].id : 0

				this.INVENTORY_LIST.push(inventory)

				this.INVENTORY_LIST = JSON.parse(JSON.stringify(this.INVENTORY_LIST))

				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
			error:(error)=>{
				this.LoadOutput.emit(false)
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
		});
	}

	private getUserByPhone(value:string){
		this.INVENTORY_LIST = []
		this.LoadOutput.emit(true)
		this.service
			.getUserByPhone(value)
			.pipe(
				tap(r=>r.length == 0 ? this.INVENTORY_LIST = [] : null),
				switchMap(items => from(items).pipe(
					concatMap(user=>{
						return this.service.getOrderByUserId(user.id || 0).pipe(
							map(order => [{user:user, order:order || []}])
						);
					})
				)),
			).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				let inventory:Inventory = {
					user:items[0].user,
					order:items[0].order,
					id_order_recently:0
				}
				let order = this.currentDate(inventory)
				inventory.id_order_recently = order.length > 0 ? order[0].id : 0
				this.INVENTORY_LIST.push(inventory)
				this.INVENTORY_LIST = JSON.parse(JSON.stringify(this.INVENTORY_LIST))
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
			error:(error)=>{
				this.LoadOutput.emit(false)
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
		});
	}

	public feed(){
		this.LoadOutput.emit(true)
		this.INVENTORY_LIST = []
		this.service
			.getUserAll()
			.pipe(
				tap(r=>r.length == 0 ? this.INVENTORY_LIST = [] : null),
				switchMap(items => from(items).pipe(
					concatMap(user=>{
						return this.service.getOrderByUserId(user.id || 0).pipe(
							map(order => [{user:user, order:order || []}])
						);
					})
				)),
			).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				let inventory:Inventory = {
					user:items[0].user,
					order:items[0].order,
					id_order_recently:0
				}
				let order = this.currentDate(inventory)
				inventory.id_order_recently = order.length > 0 ? order[0].id : 0
				this.INVENTORY_LIST.push(inventory)
				this.INVENTORY_LIST = JSON.parse(JSON.stringify(this.INVENTORY_LIST))
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
			error:(error)=>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.InventoryOutput.emit(this.INVENTORY_LIST)
				this.LoadOutput.emit(false)
			},
		});
	}

	searchFor(){
		if(this.type_search == 'name'){
			const name = this.validateName(this.search.value)
			if(name == true){
				this.getUserByName(this.search.value)
			}
		}

		if(this.type_search == 'phone'){
			const phone = this.validatePhone(this.search.value)
			if(phone == true){
				this.getUserByPhone(this.search.value)
			}
		}

		if(this.type_search == 'cpf'){
			const cpf = this.validateCPF(this.search.value)
			if(cpf == true){
				this.getUserByCPF(this.search.value)
			}
		}
	}

	private validateName(value:string){
		const name = value == null ? '' : value
		if(name.length <= 3){
			this._snackBar.error('Por favor, preencha o nome')
			return false
		}
		return true
	}

	private validatePhone(value:string){
		const phone = value == null ? '' : value
		if(phone.length <  10){
			this._snackBar.error('Por favor, preencha o telefone')
			return false
		}
		return true
	}

	private validateCPF(value:string){
		const cpf = value == null ? '' : value
		if(cpf.length <  11){
			this._snackBar.error('Por favor, preencha o CPF')
			return false
		}
		return true
	}

	private currentDate(inventory:Inventory):Order[] {
		let order = inventory.order
        if(order == undefined || order == null || order.length == 0){
            return []
        }
        var max_dt = order[0]
        var max_dtObj = new Date(order[0].horary_check_in.toString());
        order.forEach(function(dt, index){
            if ( new Date( dt.horary_check_in.toString() ) > max_dtObj){ 
                max_dt = dt;
                max_dtObj = new Date(dt.horary_check_in.toString());
            }
        });
        return [max_dt];
    }

	ngOnDestroy(): void {
		this.unsubscribe$.complete();
	}
}
