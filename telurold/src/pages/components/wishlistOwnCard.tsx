import { AuthContext, CartProduct, Product, WishlistDetails } from "modules/authProvider";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import style from "../../styles/style.module.scss"


const WishlistOwnCard = (props: {cartProd: WishlistDetails}) => {
    const cartProd = props.cartProd
    const [prod, setProd] = useState<Product>()
    const router = useRouter()
    const [averageReview, setAverageReview] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)

    const { user }  = useContext(AuthContext)

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

    

    useEffect(() => {
        const updateCart = async () => {
            try {
                const res = await fetch("http://localhost:1234/updateWishlistDetail", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: parseInt(user.id),
                        wishlist_detail_id: cartProd.wishlist_detail_id,
                        quantity: count
                    }),
                });

                if (res.ok) {
                    console.log("success update");
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

    const deleteHandler = async() => {
        try {
            const res = await fetch("http://localhost:1234/deleteWishlistDetail", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    user_id: parseInt(user.id),
                    wishlist_detail_id: cartProd.wishlist_detail_id,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                alert("delete success !")
                window.location = window.location
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

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
                        <button onClick={handleDecrement}>-</button>
                        <p>{count} item(s)</p>
                        <button onClick={handleIncrement}>+</button>
                    </div>
                    <h2>${prod.price * count}</h2>
                    <button onClick={deleteHandler}>Delete</button>
                </div>
            </div>
        );
    } else {
        return (
            <p>Loading...</p>
        )
    }
}
 
export default WishlistOwnCard;