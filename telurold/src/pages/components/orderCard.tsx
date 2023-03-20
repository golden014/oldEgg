import { Order, OrderDetail } from "modules/authProvider";
import style from "../../styles/style.module.scss"

const OrderCard = (props: {order: Order, role: string}) => {




    const order = props.order

    const onClickHandler = async() => {
        try {
            const res = await fetch("http://localhost:1234/updateOrderStatus", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    order_id: order.order_id
                }),
            });

            if (res.ok) {
                alert("Update Status Success!")
                
                
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    if (props.role === "user") {
        return (  
            <div className={style.order_card_container}>
                <div className={style.left}>
                    <p>{order.date_ordered}</p>
                    <p>#{order.invoice_code}</p>
                    <p>Order Number: {order.order_id}</p>
                </div>
                <div className={style.mid}>
                    <h1>{order.status}</h1>
                </div>
            </div>
        );
    } else {
        return (  
            <div className={style.order_card_container}>
                <div className={style.left}>
                    <p>{order.date_ordered}</p>
                    <p>#{order.invoice_code}</p>
                    <p>Order Number: {order.order_id}</p>
                </div>
                <div className={style.mid}>
                    <h1>{order.status}</h1>
                </div>
                <div className={style.right}>
                    <button onClick={onClickHandler}>Mark as Done</button>
                </div>  
            </div>
        );
    }
}
 
export default OrderCard
;