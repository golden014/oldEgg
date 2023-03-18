import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useContext, useEffect, useState } from "react";
import { AuthContext, Cart, CartProduct } from "modules/authProvider";
import CartCard from "./components/cartCard";

const CartPage = () => {

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
                            user_id: user.id
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
                    {cartProduct.map((prod) => (
                        <CartCard cartProd={prod} />
                    ))}
                </div>
                <div className={style.title}>
                    <h1>Saved For Later</h1>
                </div>
            </div>
        </Theme>
    );
}
 
export default CartPage;