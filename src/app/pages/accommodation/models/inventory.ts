import { Order } from "./order"
import { User } from "./user"

export interface Inventory {
    user:User
    order:Order[]
    id_order_recently:number
}