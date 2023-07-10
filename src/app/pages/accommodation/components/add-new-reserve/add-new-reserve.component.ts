import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Order, StatusOrder } from '../../models/order';
import { AccommodationApiService } from '../../services/api/accommodation-api.service';
import { OpenSnackBarService } from 'src/app/shared/services/open_snack_bar.service';

@Component({
	selector: 'app-add-new-reserve',
	templateUrl: './add-new-reserve.component.html',
	styleUrls: ['./add-new-reserve.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewReserveComponent {

	public daysMondayToFriday:Date[] = [];
	public daysWeekend:Date[] = [];
	public priceMondayToFriday:number = 0
	public priceWeekend:number = 0
	public priceCarMondayToFriday:number = 0
	public priceCarWeekend:number = 0
	public carSpacesChecked:boolean = false;
	public price:number = 0
	public id: string = ''
	private unsubscribe$ = new Subject();
	public loading:boolean = false

	constructor(private route: ActivatedRoute, private redirect:Router, private service:AccommodationApiService, private _snackBar: OpenSnackBarService,) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.id = params.get('id') || '0';
		});
	}

	public range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	});

	open(){
		var start:any = this.range.value.start
		var end:any = this.range.value.end

		if(!(start && end)){
			return
		}
		this.reset()

		var now = new Date(end);

		for (var d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
			var dayOfWeek = d.getDay();
        	var isWeekend = (dayOfWeek === 6) || (dayOfWeek  === 0); // 6 = Saturday, 0 = Sunday
			if(isWeekend){
				this.daysWeekend.push(new Date(d));
			}else{
				this.daysMondayToFriday.push(new Date(d));
			}
			
		}
		this.priceMondayToFriday = this.daysMondayToFriday.length * 120
		this.priceWeekend = this.daysWeekend.length * 180
		this.price = this.priceMondayToFriday + this.priceWeekend + this.priceCarMondayToFriday + this.priceCarWeekend
	}

	setCarSpacesChecked(){
		if(this.daysWeekend.length > 0){
			if(!this.carSpacesChecked ){
				this.priceCarWeekend = this.daysWeekend.length * 20
			}else{
				this.daysWeekend.filter(r=>this.priceCarWeekend = this.priceCarWeekend - 20)
			}
		}

		if(this.daysMondayToFriday.length > 0){
			if(!this.carSpacesChecked){
				this.priceCarMondayToFriday = this.daysMondayToFriday.length * 15
			}else{
				this.daysMondayToFriday.filter(r=>this.priceCarMondayToFriday = this.priceCarMondayToFriday - 15)
			}
		}
		this.price = this.priceMondayToFriday + this.priceWeekend + this.priceCarMondayToFriday + this.priceCarWeekend
	}

	reset(){
		this.daysMondayToFriday = []
		this.daysWeekend = []
		this.price = 0
		this.priceMondayToFriday = 0
		this.priceWeekend = 0
		this.priceCarMondayToFriday = 0
		this.priceCarWeekend = 0
		this.carSpacesChecked = false
	}

	reserve(){
		var start:any = this.range.value.start
		var end:any = this.range.value.end
		let order:Order = {
			id: 0,

			user_id: parseInt(this.id),

			//hóspedes que ainda estão no hotel;
			//hóspedes que tem reservas, mas ainda não realizaram o check-in. 
			//hóspedes que ja realizaram o check-in. 
			status: StatusOrder.guestsWhoHaveReservationsButHaventCheckedIn,

			//O horário para a realização do check-in será a partir das 14h00min
			//data do check-in
			horary_check_in: start.toLocaleDateString("en-US"),

			//O horário para a realização do checkout será até as 12h00min.
			//data do checkout
			horary_check_out: end.toLocaleDateString("en-US"),

			//Diárias de segunda à sexta-feira terão um valor fixo de R$ 120,00;
			daily_price_monday_to_friday: this.priceMondayToFriday,

			//Diárias em finais de semana terão um valor fixo de R$ 180,00;
			daily_price_weekends: this.priceWeekend,

			//valor da vagas de segunda à sexta-feira  R$ 15,00
			price_of_car_spaces_monday_to_friday: this.priceCarMondayToFriday,

			//valor da vagas de carro finais de semana R$ 20,00
			price_of_car_spaces_weekend: this.priceCarWeekend,

			//procedimento seja realizado posterior, deverá ser cobrada uma taxa adicional de
			//50% do valor da diária
			additional_fee_percentage_of_later_check_in: 0,

			list_days_monday_to_friday:this.daysMondayToFriday.map(r=>r.toLocaleDateString("en-US")),
			
			list_days_weekend: this.daysWeekend.map(r=>r.toLocaleDateString("en-US")),
		}

		this.service.createOrder(order).pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (order)=>{
				this._snackBar.success('Reserve create with success')
				this.loading = false
				this.reset()
				this.redirect.navigate([`/accommodation/order/${order.id}/detail`])
			},
			error:(error)=>{
				this._snackBar.error(`There was an error! ${error.message}`)
				this.loading = false
			},
			complete:()=>{
				this.loading = false
			},
		});
	}
	
	ngOnDestroy(): void {
		this.unsubscribe$.complete();
	}
}
