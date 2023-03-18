import { CartProduct, Product } from "modules/authProvider";
import { useState, useEffect } from "react";
import style from "../../styles/style.module.scss"

const CartCard = (props: {cartProd: CartProduct}) => {
    const cartProd = props.cartProd
    const [prod, setProd] = useState<Product>()

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
            <div className={style.cart_card_container}>
                <img src={prod.product_image} alt="" />
                <p>${prod.price}</p>
                <p>subTotal: ${prod.price * cartProd.quantity}</p>
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        )
    }
}
 
export default CartCard;