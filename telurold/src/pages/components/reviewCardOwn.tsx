import { AuthContext, Product, Review, UserInfo } from "modules/authProvider";
import style from "../../styles/style.module.scss"
import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router";
import Rating from "./rating";

const ReviewCardOwn = (props: {review: Review}) => {
    const [product, setProduct] = useState<Product>()
    const review = props.review
    const router = useRouter()
    const { user } = useContext(AuthContext)

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
                            <p onClick={(e) => router.push("/reviewDetail/" + review.review_id)}>Edit</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
 
export default ReviewCardOwn;