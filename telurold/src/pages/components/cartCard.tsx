import { CartProduct, Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import style from "../../styles/style.module.scss"

const CartCard = (props: {cartProd: CartProduct}) => {
    const cartProd = props.cartProd
    const [prod, setProd] = useState<Product>()
    const router = useRouter()
    

    const [count, setCount] = useState(cartProd.quantity);

    const handleIncrement = () => {
        setCount(count + 1)
    };

    const handleDecrement = () => {
        if (count <= 0) {

        } else  {
            setCount(count - 1);
        }
    };

    //saat count berubah akan
    useEffect(() => {
        const updateCart = async () => {
            try {
                const res = await fetch("http://localhost:1234/updateCartProduct", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        cart_id: cartProd.cart_id,
                        product_id: cartProd.product_id,
                        quantity: count
                    }),
                });

                if (res.ok) {
                    console.log("success update");
                    
                    // const data = await res.json();
                    // setProd(data)
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }
        updateCart()
    }, [count])

    useEffect(() => {
        const getProductById = async () => {
            try {
                const res = await fetch("http://localhost:1234/getProductById", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        product_id: String(cartProd.product_id)
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setProd(data)
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }
        getProductById()
    }, [])

    if (prod) {
        return (  
            <div className={style.cart_card}>
                <div className={style.cart_card_left}>
                    <img src={prod.product_image} alt=""/>
                    <div className={style.details}>
                        <h2 onClick={(e) =>router.push("/product/" + prod.product_id)}>{prod.product_name}</h2>
                        <p>{prod.product_description}</p>
                    </div>
                </div>
                <div className={style.cart_card_right}>
                    <p>${prod.price} each</p>
                    <div className={style.spinner}>
                        <button onClick={handleDecrement}>-</button>
                        <h2>{count}</h2>
                        <button onClick={handleIncrement}>+</button>
                    </div>
                    <h2>${prod.price * count}</h2>
                </div>
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        )
    }
}
 
export default CartCard;