import { async } from "@firebase/util";
import { Product, Review, UserInfo } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"
import Rating from "./rating";

const ReviewCard = (props: {review:Review}) => {
    
    const [user, setUser] = useState<UserInfo>() 
    const [product, setProduct] = useState<Product>()
    const review = props.review
    
    //bikin saat onclick

    const [helpful, setHelpful] = useState(review.helpful_count)
    const [unhelpful, setUnhelpful] = useState(review.unhelpful_count)

    const updateCount = async(count_type: string, update_type: string) => {
        try {
            const res = await fetch("http://localhost:1234/updateCountsProduct", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    product_id: review.product_id,
                    count_type: count_type,
                    update_type: update_type,
                    review_id: review.review_id
                }),
            });

            if (res.ok) {
                
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    
    }

    const helpfulAddHandler = () => {
        if (helpful == review.helpful_count) {
            setHelpful(helpful + 1)
            updateCount("helpful", "add")
        } else {
            setHelpful(helpful - 1)
            updateCount("helpful", "substract")
        }
    }

    const unhelpfulAddHandler = () => {
        if (unhelpful == review.unhelpful_count) {
            setUnhelpful(unhelpful + 1)
            updateCount("unhelpful", "add")
        } else {
            setUnhelpful(unhelpful - 1)
            updateCount("unhelpful", "substract")
        }
    }

    useEffect(() => {
        const getUserById = async () => {
            try {
                const res = await fetch("http://localhost:1234/getUserById", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        user_id: review.user_id
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data)
                    
                    
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getUserById()
    }, [])

    useEffect(() => {
        const getProductById = async () => {
            try {
                const res = await fetch("http://localhost:1234/getProductById", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        product_id: String(review.product_id)
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setProduct(data)
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }
        getProductById()
    }, [])

    const router = useRouter()

    return (  
        <div className={style.center}>
            <div className={style.review_card_container}>
                
                <div className={style.review_card_left}>
                    <h2>{user?.firstname} {user?.lastname}</h2>
                    <p onClick={(e) => router.push("/product/" + product?.product_id)}>on {product?.product_name}</p>
                    <br />
                    <p>{review.review_time}</p>
                </div>
            
                <div className={style.review_card_right}>
                    <div className={style.left}>
                        <div className={style.header}>
                            <Rating rating={review.rating} />
                            <p>|</p> <br />
                            <h2>{review.review_title}</h2>
                        </div>
                        <p>{review.review_description}</p>
                    </div>

                    <div className={style.right}>
                        <div className={style.top}>
                            <p>Edit</p>
                        </div>

                        <div className={style.bottom}>
                            <p onClick={(e) => helpfulAddHandler()}>{helpful}| Helpful</p>
                            <p onClick={(e) => unhelpfulAddHandler()}>{unhelpful}| Unhelpful</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
 
export default ReviewCard;