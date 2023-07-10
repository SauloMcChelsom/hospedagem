import { ChangeDetectionStrategy, Component, ViewChild, ChangeDetectorRef, Output, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, concat, concatMap, empty, forkJoin, from, map, switchMap, takeUntil, tap, toArray } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AccommodationApiService } from '../../services/api/accommodation-api.service';
import { User } from '../../models/user';
import { OpenSnackBarService } from 'src/app/shared/services/open_snack_bar.service';
import { Inventory } from '../../models/inventory';
import { Order, StatusOrder } from '../../models/order';

@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {

	public loading:boolean = false

	private unsubscribe$ = new Subject();

	public daysMondayToFriday:string[] = []

	public daysWeekend:string[] = []

	public sumDaily:number = 0

	public sumCar:number = 0

	public sumDailyCar:number = 0

	public order:Order = {
		additional_fee_percentage_of_later_check_in:0,
		daily_price_monday_to_friday:0,
		daily_price_weekends:0,
		horary_check_in:"",
		list_days_monday_to_friday:[],
		list_days_weekend:[],
		price_of_car_spaces_monday_to_friday:0,
		price_of_car_spaces_weekend:0,
		status: StatusOrder.None,
		horary_check_out:"",
		id:0,
		user_id:0
	}

	public inventory:Inventory = {
		id_order_recently:0,
		order:[],
		user:{
			id:0,
			cpf:'',
			name:'',
			phone:''
		}
	}

	constructor(private route: ActivatedRoute, private redirect:Router, private _snackBar: OpenSnackBarService, private cd: ChangeDetectorRef, private service:AccommodationApiService) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => {
			const id = params.get('id') || '0';
			this.getOrderById(id)
		});
	}
	private getOrderById(id:string){
		this.service
			.getOrderById(parseInt(id))
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
				console.log(inventory)
				this.inventory = inventory
				this.daysMondayToFriday = this.inventory.order[0].list_days_monday_to_friday
				this.daysWeekend = this.inventory.order[0].list_days_weekend
				this.order = this.inventory.order[0]

				this.sumDaily = this.order.daily_price_monday_to_friday + this.order.daily_price_weekends
				this.sumCar = this.order.price_of_car_spaces_monday_to_friday + this.order.price_of_car_spaces_weekend

				this.sumDailyCar = this.sumDaily + this.sumCar

				this.cd.markForCheck()
			},
			error:(error)=>{

			},
			complete:() =>{

			},
		});
	}

	public checkIn(){
		this.loading = true
		this.service.checkIn(this.order).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				this._snackBar.success(`Check-In with success`)
				this.cd.markForCheck()
				this.loading = false
			},
			error:(error)=>{
				this.cd.markForCheck()
				this.loading = false
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.cd.markForCheck()
				this.loading = false
			},
		});
	}

	public checkOut(){
		this.loading = true
		this.service.checkOut(this.order.id).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (items)=>{
				if(items.status == "GUESTS_WHO_HAVE_ALREADY_CHECKED_IN"){
					this._snackBar.success(`Check-out with success`)
					this.cd.markForCheck()
					this.loading = false
					this.redirect.navigate(['/accommodation'])
				}else{
					this._snackBar.error(`Não foi possivel realizar Check-out`)
				}
			},
			error:(error)=>{
				this.cd.markForCheck()
				this.loading = false
				this._snackBar.error(`There was an error! ${error.message}`)
			},
			complete:() =>{
				this.cd.markForCheck()
				this.loading = false
			},
		});
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
