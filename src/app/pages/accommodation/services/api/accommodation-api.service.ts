import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../../models/order';

const url =  environment.url;

@Injectable({
	providedIn: 'root',
})
export class AccommodationApiService {
	constructor(private http: HttpClient) {}

	getOrderAll(): Observable<Order[]> {
		return this.http.get<Order[]>(`${url}/order?_sort=id&_order=desc`).pipe(map(r=>r));
	}

	getUserAll(): Observable<User[]> {
		return this.http.get<User[]>(`${url}/user?_sort=id&_order=desc`).pipe(map(r=>r));
	}

	getUserById(value:number): Observable<User[]> {
		return this.http.get<User[]>(`${url}/user?id=${value}`).pipe(map(r=>r));
	}

	getUserByCPF(value:string): Observable<User[]> {
		return this.http.get<User[]>(`${url}/user?cpf=${value}`);
	}

	getUserByName(value:string): Observable<User[]> {
		return this.http.get<User[]>(`${url}/user?name=${value}`);
	}

	getUserByPhone(value:string): Observable<User[]> {
		return this.http.get<User[]>(`${url}/user?phone=${value}`);
	}

	getUserByOderGuest(): Observable<Order[]> {
		return this.http.get<Order[]>(`${url}/order?status=GUESTS_WHO_ARE_STILL_AT_THE_HOTEL`);
	}

	getUserByOderGuestNotCheckIn(): Observable<Order[]> {
		return this.http.get<Order[]>(`${url}/order?status=GUESTS_WHO_HAVE_RESERVATIONS_BUT_HAVENT_CHECKED_IN`);
	}

	getUserByOderGuestHaveAlreadyCheckIn(): Observable<Order[]> {
		return this.http.get<Order[]>(`${url}/order?status=GUESTS_WHO_HAVE_ALREADY_CHECKED_IN`);
	}

	getOrderByUserId(value:number): Observable<Order[]> {
		return this.http.get<Order[]>(`${url}/order?user_id=${value}`);
	}

	getOrderById(value:number): Observable<Order[]> {
		return this.http.get<Order[]>(`${url}/order?id=${value}`);
	}

	createUser(value: User): Observable<User> {
		return this.http.post<User>(`${url}/user`, value);
	}

	createOrder(value: Order): Observable<Order> {
		return this.http.post<Order>(`${url}/order`, value);
	}

	checkIn(value: Order): Observable<Order> {
		return this.http.post<Order>(`${url}/checkin`, value);
	}

	checkOut(value: number): Observable<Order> {
		return this.http.get<Order>(`${url}/check-out/order/${value}`);
	} 

	updateUser(value: User): Observable<User> {
		return this.http.put<User>(url + value.id, value);
	}

	deleteUser(value: User): Observable<void> {
		return this.http.delete<void>(url + value.id);
	}
}
