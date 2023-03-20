import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useContext, useEffect, useState } from "react";
import { AuthContext, Order } from "modules/authProvider";
import OrderCard from "./components/orderCard";
import OrdersComponent from "./components/ordersComponent";

const UserOrders = () => {

    const [orders, setOrders] = useState<Order[]>([])
    const [filtered, setFiltered] = useState<Order[]>([])
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
                    setFiltered(data)
                } else {
                    console.log("smth went wrong retreiving data");
                }

            } catch (error){
                console.log(error);                
            }
        }
        getOrders()
    }, [user])

    const [search, setSearch] = useState("")

    useEffect

    return (  
        <Theme>
            <div className={style.user_orders_container}>
                <div className={style.user_orders_header}>
                    <div className={style.search}>
                        <p>Search: </p>
                        <input type="text" onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div></div>
                </div>
                <OrdersComponent orders={filtered} />
            </div>
        </Theme>
    );
    // }
}
 
export default UserOrders;