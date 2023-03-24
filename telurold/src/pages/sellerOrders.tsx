import { Order } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import OrdersComponent from "./components/ordersComponent";
import Space from "./components/space";

const SellerOrders = () => {

    const router = useRouter();
    const { store_id } = router.query;
    
    const [orders, setOrders] = useState<Order[]>([])
    const [filtered, setFiltered] = useState<Order[]>([])
    const [status, setStatus] = useState("On Process")

    useEffect(() => {
        if (store_id) {
            const getOrders = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getOrderByStoreId", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            //intinya karena storeid itu string | string [], jdi hrus diginii
                            store_id: parseInt(Array.isArray(store_id) ? store_id[0].toString() : store_id.toString())
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
        }
    }, [store_id])

    useEffect(() => {
        if (store_id) {
            const getOrdersSearch = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getStoreOrdersByFilter", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            store_id: parseInt(Array.isArray(store_id) ? store_id[0].toString() : store_id.toString()),
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
        }
    }, [status])


    return (  
        <Theme>
             <div className={style.user_orders_container}>
                <div className={style.user_orders_header}>
                    <div className={style.filter}>
                        <p>Filter by open/cancelled</p>
                        <select onChange={(e) => setStatus(e.target.value)}>
                            <option value=""></option>
                            <option value="On Process">On Process</option>
                            <option value="Done">Done</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <OrdersComponent orders={filtered} role={"seller"}/>
            </div>
            <Space/>
        </Theme>
    );
}
 
export default SellerOrders;