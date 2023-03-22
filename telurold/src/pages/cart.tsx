import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useContext, useEffect, useState } from "react";
import { AuthContext, Cart, CartProduct } from "modules/authProvider";
import CartCard from "./components/cartCard";
import { useRouter } from "next/router";
import WishlistPublicCard from "./components/wishlistPublicCard";

const CartPage = () => {

    const router = useRouter()
    const [cartProduct, setCartProduct] = useState<CartProduct[]>([])
    
    const { user } = useContext(AuthContext)
    const [cart, setCart] = useState<Cart>()
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

    return (  
        <Theme>
            <div className={style.cart_page_container}>
                <div className={style.title}>
                    <h1>Cart</h1>
                </div>
                <div className={style.cart_details}>
                   <div className={style.cart_details_left}>
                        {cartProduct.map((prod) => (
                            <div className={style.cart_card_container}>
                                <CartCard cartProd={prod} />
                            </div>                        
                        ))}
                   </div>
                   <div className={style.cart_details_right}>
                        <h1>Summary</h1>
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
                        <button className={style.buttonss} onClick = {(e) => router.push("/checkout")}>
                            Checkout
                        </button>
                   </div>
                    
                </div>
                <div className={style.title}>
                    <h1>Saved For Later</h1>
                </div>
                <div style={{height: "1000px"}}>

                </div>
            </div>
        </Theme>
    );
}
 
export default CartPage;