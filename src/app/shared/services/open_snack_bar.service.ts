import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class OpenSnackBarService {
	//public loading:boolean = false

	public durationInSeconds = 10;

	public horizontalPosition: MatSnackBarHorizontalPosition = 'center';

	public verticalPosition: MatSnackBarVerticalPosition = 'top';

	constructor(private _snackBar: MatSnackBar) {}

	public error(text: string) {
		this._snackBar.open(text, 'fechar', {
			duration: this.durationInSeconds * 1000,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass: ['snackbar-error'],
		});
	}

	public success(text: string) {
		this._snackBar.open(text, 'fechar', {
			duration: this.durationInSeconds * 400,
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			panelClass: ['snackbar-success'],
		});
	}
}
