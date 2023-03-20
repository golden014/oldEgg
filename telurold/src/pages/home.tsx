import Navbar from "./components/navbar";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "modules/authProvider";







const Home = () => {

    const { setAuthenticated } = useContext(AuthContext)
    const router = useRouter();

    const submitHandler =async (e:any) => {
        e.preventDefault()
    
        try {
            const res = await fetch("http://localhost:1234/logout", {
                method: "GET"
            })
    
            if (res.ok) {
                localStorage.setItem("user_info", "");
                router.push("/login");
                // setAuthenticated(false)
                
            }
        } catch (error) {
            console.log(error)
        }
        router.push("/login")
    
    }

    var userInfoObject;
    if (typeof window !== 'undefined' && window.localStorage) {
        const userInfoString = localStorage.getItem("user_info");
        if (userInfoString) {
            userInfoObject = JSON.parse(userInfoString);
            console.log(userInfoObject.firstName);
        }

    }

    const [balance, setBalance] = useState(0)

    useEffect(() => {
        const userInfoString = localStorage.getItem("user_info");
        if (userInfoString) {
            userInfoObject = JSON.parse(userInfoString);
            setBalance(userInfoObject.balance)
        }
    }, [])


    return ( 
        <Theme>
            <div className={style.home_container}>
                <p>Balance/Currency: ${balance}</p>
                <div>
                    <button onClick={submitHandler}>Logout</button>
                </div>

                <button onClick={(e) => router.push("/inputVoucher")}>Input Voucher</button>
                <button onClick={(e) => router.push("/userOrders")}>View your orders</button>
                <button onClick={(e) => router.push("/userReviews")}>View your reviews</button>
            </div>
        </Theme>

     );
}
 
export default Home;