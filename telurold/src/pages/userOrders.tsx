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
    const [search, setSearch] = useState("")
    const [dates, setDates] = useState(7)
    const [status, setStatus] = useState("")

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

    useEffect(() => {
        const getOrdersSearch = async () => {
            try {
                const res = await fetch("http://localhost:1234/getUserOrderByKeyword", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: parseInt(user.id),
                        keyword: search
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setFiltered(data)
                    
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getOrdersSearch()
    }, [search])

    useEffect(() => {
        const getOrdersSearch = async () => {
            try {
                const res = await fetch("http://localhost:1234/getUserOrdersByDates", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: parseInt(user.id),
                        days: dates
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setFiltered(data)
                    
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getOrdersSearch()
    }, [dates])

    useEffect(() => {
        const getOrdersSearch = async () => {
            try {
                const res = await fetch("http://localhost:1234/getUserOrdersByFilter", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: parseInt(user.id),
                        filter: status
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setFiltered(data)
                    
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getOrdersSearch()
    }, [status])

    return (  
        <Theme>
            <div className={style.user_orders_container}>
                <div className={style.user_orders_header}>
                    <div className={style.search}>
                        <p>Search: </p>
                        <input type="text" onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className={style.filter}>
                        <p>Filter by open/cancelled</p>
                        <select onChange={(e) => setStatus(e.target.value)}>
                            <option value=""></option>
                            <option value="On Process">On Process</option>
                            <option value="Done">Done</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className={style.filter}>
                        <p>Filter by dates</p>
                        <select onChange={(e) => setDates(parseInt(e.target.value))}>
                            <option value="0"></option>
                            <option value="7">Recent Orders</option>
                            <option value="30">Since 30 Days Ago</option>
                            <option value="90">Since 3 Months Ago</option>
                        </select>
                    </div>
                </div>
                <OrdersComponent orders={filtered} role={"user"}/>
            </div>
        </Theme>
    );
    // }
}
 
export default UserOrders;