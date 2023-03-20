import { Order, OrderDetail } from "modules/authProvider";
import style from "../../styles/style.module.scss"

const OrderCard = (props: {order: Order}) => {

    const order = props.order
    return (  
        <div className={style.order_card_container}>
            <h1>{order.order_id}</h1>
        </div>
    );
}
 
export default OrderCard
;