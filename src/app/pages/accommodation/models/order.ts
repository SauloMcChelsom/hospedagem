export enum StatusOrder {
  GuestsWhoAreStillAtTheHotel = 'GUESTS_WHO_ARE_STILL_AT_THE_HOTEL',
  guestsWhoHaveReservationsButHaventCheckedIn = 'GUESTS_WHO_HAVE_RESERVATIONS_BUT_HAVENT_CHECKED_IN',
  GuestsWhoHaveAlreadyCheckedIn = 'GUESTS_WHO_HAVE_ALREADY_CHECKED_IN',
  CHECK_IN_SERA_PARTIR_DAS_14H00MIN = "CHECK_IN_SERA_PARTIR_DAS_14H00MIN",
  CHECK_IN_SUCCESS = "CHECK_IN_SUCCESS",
  CHECK_OUT_SERA_PARTIR_DAS_12H00MIN = "CHECK_OUT_SERA_PARTIR_DAS_12H00MIN",
  None = 'NONE'
}

export interface Order {
    id: number

    user_id: number

    //hóspedes que ainda estão no hotel;
    //hóspedes que tem reservas, mas ainda não realizaram o check-in. 
    //hóspedes que ja realizaram o check-in. 
    status: StatusOrder

    //O horário para a realização do check-in será a partir das 14h00min
    horary_check_in: string

    //O horário para a realização do checkout será até as 12h00min.
    horary_check_out: string

    //Diárias de segunda à sexta-feira terão um valor fixo de R$ 120,00;
    daily_price_monday_to_friday: number

    //Diárias em finais de semana terão um valor fixo de R$ 180,00;
    daily_price_weekends: number

    //valor da vagas de segunda à sexta-feira  R$ 15,00
    price_of_car_spaces_monday_to_friday: number

    //valor da vagas de carro finais de semana R$ 20,00
    price_of_car_spaces_weekend: number

    //procedimento seja realizado posterior, deverá ser cobrada uma taxa adicional de
    //50% do valor da diária
    additional_fee_percentage_of_later_check_in: number

    list_days_monday_to_friday:string[]
    
    list_days_weekend:string[]
}