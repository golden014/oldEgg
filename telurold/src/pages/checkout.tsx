import { Address, AuthContext, Cart, CartProduct } from "modules/authProvider";
import { useContext, useEffect, useState } from "react";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import CartCard from "./components/cartCard";
import { useRouter } from "next/router";
import CheckOutCard from "./components/checkOutCard";

const Checkout = () => {
    const [cartProduct, setCartProduct] = useState<CartProduct[]>([])
    
    const { user } = useContext(AuthContext)
    const [cart, setCart] = useState<Cart>()
    const router = useRouter()
    const [addresses, setAddresses] = useState<Address[]>([])

    useEffect(() => {
        //ambil info cart berdasarkan user id
        const getReviewsByProductId = async () => {
            console.log("awikwokk");
            if (user) {
                try {
                    const res = await fetch("http://localhost:1234/getCartByUserId", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            user_id: parseInt(user.id)
                        }),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        setCart(data)
                        
                        
                    } else {
                        console.log("smth went wrong retreiving reviews");
                    }
    
                } catch (error){
                    console.log(error);                
                }
            }
        }
        
        getReviewsByProductId()
    }, [user])

    useEffect(() => {
        //ambil cartProduct berdasarkan cart
        const getCartProds = async () => {
            if (cart) {
                console.log("cart_id: " + cart?.cart_id);
                
                try {
                    const res = await fetch("http://localhost:1234/getCartProduct", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            cart_id: cart.cart_id
                        }),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        setCartProduct(data)
                    } else {
                        console.log("smth went wrong retreiving reviews");
                    }
    
                } catch (error){
                    console.log(error);                
                }
            }
        }

        getCartProds()
    }, [cart])

    useEffect(() => {
        //ambil address 
        const getAddresses = async () => {
            if (user) {
                try {
                    const res = await fetch("http://localhost:1234/getAllAddressByUserId", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            user_id: parseInt(user.id)
                        }),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        setAddresses(data)
                    } else {
                        console.log("smth went wrong retreiving reviews");
                    }
    
                } catch (error){
                    console.log(error);                
                }
            }
        }

        getAddresses()
    }, [user])

    const removeAddress = async(address_id: number) => {
        try {
            const res = await fetch("http://localhost:1234/removeAddress", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    address_id: address_id
                }),
            });

            if (res.ok) {
                window.location = window.location
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    const [newAddress, setNewAddress] = useState("")

    const addNewAddress = async(newAddress: string) => {
        try {
            const res = await fetch("http://localhost:1234/addAddress", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    address_name: newAddress,
                    user_id: parseInt(user.id)
                }),
            });

            if (res.ok) {
                window.location = window.location
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    const [payment, setPayment] = useState("")


    const createOrder = async() => {
        try {
            const res = await fetch("http://localhost:1234/createOrder", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    cart_id: cart?.cart_id,
                    user_id: parseInt(user.id),
                    date_ordered: (new Date()).toLocaleDateString(),
                    invoice_code: Math.random().toString(36).substring(2, 8),
                    payment: payment
                }),
            });

            if (res.ok) {
                alert("order success")
                router.push("/cart")
            } else {
                if (payment === "oldEgg")
                alert("your oldEgg balance is not enough")
            }

        } catch (error){
            console.log(error);                
        }
    }

    if (cartProduct) {

        return (  
            <Theme>
                <div className={style.cart_page_container}>
                    <div className={style.title}>
                        <h1>Checkout</h1>
                    </div>
                    <div className={style.cart_details}>
                       <div className={style.cart_details_left}>
                            {cartProduct.map((prod) => (
                                <div className={style.cart_card_container}>
                                    <CheckOutCard cartProd={prod} />
                                </div>                        
                            ))}
                       </div>
                       <div className={style.cart_details_right}>
                            <h1>Order Summary</h1>
                            <br />
                            <div className={style.summary_details}>
                                <p>Item(s):</p>
                                <p>${cart?.total}</p>
                            </div>
                            <div className={style.summary_details}>
                                <p>Est. Delivery:</p>
                                <p>$ 10.0</p>
                            </div>
                            <div className={style.summary_total}>
                                <h2>Est. Total:</h2>
                                <h1>${cart?.total ? cart.total + 10: cart?.total}.00</h1>
                            </div>
                            <br />
                            <button className={style.buttonss} onClick = {createOrder}>
                                Order
                            </button>
                       </div>
                        
                    </div>
                    <div className={style.title}>
                        <br />
                        <h1>Choose Address</h1>
                    </div>
                    <div className={style.addresses_container}>
                        <div className={style.address_card}>
                            <h2>Add New Address</h2>
                            <input type="text" placeholder="Input new address" onChange={(e) => setNewAddress(e.target.value)}/>
                            <button onClick={(e) => addNewAddress(newAddress)} style={{backgroundColor: "#050c2e"}}>
                                Add
                            </button>
                        </div>
                        {addresses.map((adr) => (
                            <div className={style.address_card}>
                                <h2>{adr.address_name}</h2>
                                <button onClick={(e) => removeAddress(adr.address_id)}>Remove Address</button>
                            </div>
                        ))}
                    </div>
                    <div className={style.title}>
                        <br />
                        <h1>Choose Delivery Provider</h1>
                    </div>
                    <div className={style.address_card} style={{
                        display: "flex",
                        justifyContent: "center"
                        }}>
                        <select name="" id="">
                            <option> JNE</option>
                            <option>Gojeq</option>
                            <option>J&Ti</option>
                        </select>
                    </div>
                    <div className={style.title}>
                        <br />
                        <h1>Choose Payment</h1>
                    </div>
                    <div className={style.address_card} style={{
                        display: "flex",
                        justifyContent: "center"
                        }}>
                        <select onChange={(e) => setPayment(e.target.value)}>
                            <option value="oldEgg"> oldEgg Balance</option>
                            <option value="2">Gopai</option>
                            <option value="3">OwO</option>
                        </select>
                    </div>
                </div>
            </Theme>
        );
    } else {
        return (
            <h1>loading</h1>
        )
    }
}
 
export default Checkout;