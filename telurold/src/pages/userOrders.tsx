import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useContext, useEffect, useState } from "react";
import { AuthContext, Order } from "modules/authProvider";

const UserOrders = () => {

    const [orders, setOrders] = useState<Order[]>([])
    const { user } = useContext(AuthContext) 

    useEffect(() => {
        const getOrders = async () => {
            try {
                const res = await fetch("http://localhost:1234/getOrderByUserId", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: parseInt(user.id)
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data)
                } else {
                    console.log("smth went wrong retreiving data");
                }

            } catch (error){
                console.log(error);                
            }
        }
        getOrders()
    }, [user])

    return (  
        <Theme>
            <div className={style.user_orders_container}>
                {orders.map((order) => (
                    <div>
                        <h1>{order.order_id}</h1>
                        <h2>{order.invoice_code}</h2>
                        <h2>{order.status}</h2>
                        <br /><br />
                    </div>
                ))}
            </div>
        </Theme>
    );
}
 
export default UserOrders;