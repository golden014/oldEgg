import { Review } from "modules/authProvider";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"

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
                {reviews.map((review) => (
                    <div>
                        <h2>{review.review_id}</h2>
                        <h2>{review.product_id}</h2>
                        <h2>{review.review_description}</h2>
                        <h2>{review.rating}</h2>
                        <h2>{review.user_id}</h2>
                    </div>
                ))}
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