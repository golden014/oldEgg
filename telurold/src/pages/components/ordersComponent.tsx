import { Order } from "modules/authProvider";
import style from "../../styles/style.module.scss"
import OrderCard from "./orderCard";

const OrdersComponent = (props : {orders: Order[]}) => {

    if (props.orders.length == 0) {
        return (
            <div>
                <h1>No order yet..</h1>
            </div>
        )
    } else {
        return (  
            <div className={style.order_component_container}>
                {props.orders.map((order) => (
                    <OrderCard order={order}/>
                ))}
            </div>
        );
    }

    
}
 
export default OrdersComponent;