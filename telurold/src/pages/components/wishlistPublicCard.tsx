import { CartProduct, Product, WishlistDetails } from "modules/authProvider";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import style from "../../styles/style.module.scss"


const WishlistPublicCard = (props: {cartProd: WishlistDetails}) => {
    const cartProd = props.cartProd
    const [prod, setProd] = useState<Product>()
    const router = useRouter()
    const [averageReview, setAverageReview] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)

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

        if (cartProd) {
            getProductById()
        }
    }, [cartProd])

    useEffect(() => {
        const getProductById = async () => {
            try {
                const res = await fetch("http://localhost:1234/getReviewByProductIdStat", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        product_id: cartProd.product_id
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setAverageReview(data.average_rating)
                    setTotalReviews(data.total_reviews)
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        if (cartProd) {
            getProductById()
        }
    }, [cartProd])

    if (prod) {
        return (  
            <div className={style.cart_card}>
                <div className={style.cart_card_left}>
                    <img src={prod.product_image} alt=""/>
                    <div className={style.details}>
                        <div>
                            <p>Average reviews: {averageReview} ({totalReviews} reviews)</p>
                        </div>
                        <h2 onClick={(e) =>router.push("/product/" + prod.product_id)}>{prod.product_name}</h2>
                        <p>{prod.product_description}</p>
                    </div>
                </div>
                <div className={style.cart_card_right}>
                    <p>${prod.price} each</p>
                    <div className={style.spinner}>
                        <p>{cartProd.quantity} item(s)</p>
                    </div>
                    <h2>${prod.price * cartProd.quantity}</h2>
                </div>
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        )
    }
}
 
export default WishlistPublicCard;