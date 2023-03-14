import { Review } from "modules/authProvider"
import { useState, useEffect } from "react"
import style from "../../styles/style.module.scss"
import ReviewCard from "./reviewCard"

const ReviewsStore = (props: {store_id: any}) => {

    const [reviews, setReviews] = useState<Review[]>([])
    //useeffect ambil semua reviews berdasarkan product id
    useEffect(() => {
        const getReviewsByProductId = async () => {
            try {
                const res = await fetch("http://localhost:1234/getReviewByStoreId", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        store_id: props.store_id
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
    }, [props.store_id])

    console.log(reviews);
    

    if (reviews) {
        return (  
            <div className={style.reviews_container}>
                <br />
                {reviews.map((review) => {
                    return (
                        <div>
                            <ReviewCard review={review}/>
                            {/* <Rating rating={review.rating}/> */}
                        </div>
                    )
            })}
            <br /><br />
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
 
export default ReviewsStore;