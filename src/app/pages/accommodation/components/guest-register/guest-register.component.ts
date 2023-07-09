import { ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AccommodationApiService } from '../../services/api/accommodation-api.service';
import { User } from '../../models/user';
import { OpenSnackBarService } from 'src/app/shared/services/open_snack_bar.service';

@Component({
	selector: 'app-guest-register',
	templateUrl: './guest-register.component.html',
	styleUrls: ['./guest-register.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestRegisterComponent {

	@ViewChild('focusElement') searchElement:any = null;

	public loading:boolean = false

	public formGroup: FormGroup = new FormGroup({
		name: new FormControl(),
		phone: new FormControl(),
		cpf: new FormControl(),
	});

	public get name(): FormControl {
		return this.formGroup.get('name') as FormControl;
	}

	public get phone(): FormControl {
		return this.formGroup.get('phone') as FormControl;
	}

	public get cpf(): FormControl {
		return this.formGroup.get('cpf') as FormControl;
	}

	private unsubscribe$ = new Subject();

	constructor(private _snackBar: OpenSnackBarService, private service:AccommodationApiService, private cd: ChangeDetectorRef) {}

	ngAfterViewInit() {
		this.searchElement.nativeElement.focus();
	}

	save(){
		const name = this.validateName()
		const phone = this.validatePhone()
		const cpf = this.validateCPF()
		if(name && phone && cpf){
			let user:User = {
				name: this.name.value,
				phone: this.phone.value,
				cpf: this.cpf.value
			}
			this.loading = true
			this.service.createUser(user).pipe(takeUntil(this.unsubscribe$)).subscribe({
				next: (user)=>{
					this._snackBar.success('realizado com sucesso')
					this.loading = false
					this.reset()
					this.cd.markForCheck();
				},
				error:(error)=>{
					this._snackBar.error(`There was an error! ${error.message}`)
					this.loading = false
					this.cd.markForCheck();
				}
			});
		}
	}

	private reset(){
		this.formGroup.reset()
	}

	private validateName(){
		const name = this.name.value == null ? '' : this.name.value
		if(name.length <= 3){
			this._snackBar.error('Por favor, preencha o nome')
			return false
		}
		return true
	}

	private validatePhone(){
		const phone = this.phone.value == null ? '' : this.phone.value
		if(phone.length <  10){
			this._snackBar.error('Por favor, preencha o telefone')
			return false
		}
		return true
	}

	private validateCPF(){
		const cpf = this.cpf.value == null ? '' : this.cpf.value
		if(cpf.length <  11){
			this._snackBar.error('Por favor, preencha o CPF')
			return false
		}
		return true
	}

	ngOnDestroy(): void {
		this.unsubscribe$.complete();
	}
}
