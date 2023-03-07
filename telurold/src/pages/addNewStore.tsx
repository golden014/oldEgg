import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useState } from "react"


const AddNewStore = () => {

    const [storeName, setStoreName] = useState("")
    const [sellerID, setSellerID] = useState(0)
    const [storeEmail, setStoreEmail] = useState("")
    const [storeDescription, setStoreDescription] = useState("")
    
    const [password, setPassword] = useState("prk")
    const [banner, setBanner] = useState("https://firebasestorage.googleapis.com/v0/b/oldegg-93db0.appspot.com/o/store_banner%2F161500.jpg?alt=media&token=465cc12e-da8c-41fb-a74b-cb51d972eea2")
    const [status, setStatus] = useState("Active")
    const [productAccuracy, setProductAccuracy] = useState(0.0)
    const [deliveryStatistic, setDeliveryStatistic] = useState(0.0)
    const [serviceSatisfaction, setServiceSatisfaction] = useState(0.0)
    const [numberOfSales, setNumberOfSales] = useState(0)

    const handleAdd = async () => {
        try {

            const res = await fetch("http://localhost:1234/addNewStore", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    store_name: storeName,
                    store_password: password,
                    store_banner: banner,
                    store_status: status,
                    store_email: storeEmail,
                    product_accuracy: productAccuracy,
                    delivery_statistic: deliveryStatistic,
                    service_satisfaction: serviceSatisfaction,
                    number_of_sales: numberOfSales,
                    seller_id: sellerID
                }),
            });

            if (res.ok) {
                console.log("res ok");
                alert("Create Store Success !")
            } else {
                console.log("res not ok");
            }

            console.log(res);
        } catch (error) {
    
        }
    }



    return (  
        <Theme>
            <div className={style.voucher_balance_container}>
                <div className={style.voucher_balance_input}>
                    <p>Set Store Name</p>
                    <input type="text" placeholder="Store Name" onChange={(e) => setStoreName(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Seller ID</p>
                    <input type="number" placeholder="Seller ID" onChange={(e) => setSellerID(parseInt(e.target.value))}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Store Email</p>
                    <input type="text" placeholder="Store Email" onChange={(e) => setStoreEmail(e.target.value)}/>
                </div>

                <div className={style.voucher_balance_input}>
                    <p>Set Store Description</p>
                    <input type="text" placeholder="Store Description" onChange={(e) => setStoreDescription(e.target.value)}/>
                </div>

                <button onClick={handleAdd}>add</button>
            </div>
        </Theme>
    );
}
 
export default AddNewStore;