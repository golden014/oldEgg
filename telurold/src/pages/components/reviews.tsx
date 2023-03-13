import { Review } from "modules/authProvider";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"
import Rating from "./rating";

const Reviews = (props: {product_id: any}) => {

    const [reviews, setReviews] = useState<Review[]>([])
    //useeffect ambil semua reviews berdasarkan product id
    useEffect(() => {
        const getReviewsByProductId = async () => {
            try {
                const res = await fetch("http://localhost:1234/getReviewByProductId", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        product_id: props.product_id
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setReviews(data)
                    
                    
                } else {
                    console.log("smth went wrong retreiving reviews");
                }

            } catch (error){
                console.log(error);                
            }
        }

        getReviewsByProductId()
    }, [])

    console.log(reviews);
    

    if (reviews) {
        return (  
            <div className={style.reviews_container}>
                {reviews.map((review) => {
                    return (
                        <div>
                            <Rating rating={review.rating}/>
                        </div>
                    )
            })}
            </div>
        );
    } else {
        return (
            <div>
                Loading...
            </div>
        )
    }
}
 
export default Reviews;