import { useRouter } from "next/router";
import Theme from "../components/theme";
import { useState, useEffect, useContext } from "react"
import { AuthContext, Review } from "modules/authProvider";
import style from "../../styles/style.module.scss"

const ReviewDetail = () => {

    const router = useRouter()
    const reviewId = router.query.reviewId
    const [review, setReview] = useState<Review>()
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (reviewId) {
            const getProductById = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getReviewById", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            review_id: parseInt(Array.isArray(reviewId) ? reviewId[0].toString() : reviewId.toString())
                        }),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        setReview(data)
                    } else {
                        console.log("smth went wrong retreiving reviews");
                    }
    
                } catch (error){
                    console.log(error);                
                }
            }
            getProductById()
        }
    }, [reviewId])


    const [rating, setRating] = useState(review?.rating)
    const [onTimeDelivery, setOnTimeDelivery] = useState(review?.on_time_delivery)
    const [productAccuracy, setProductAccuracy] = useState(review?.product_accuracy)
    const [serviceSatisfaction, setServiceSatisfaction] = useState(review?.on_time_delivery)

    const handleUpdate = async(column: string, columnValue: any) => {
        if (reviewId) {
            try {
                const res = await fetch("http://localhost:1234/updateReviewByUserId", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        review_id: parseInt(Array.isArray(reviewId) ? reviewId[0].toString() : reviewId.toString()),
                        user_id: parseInt(user.id),
                        column: column,
                        new_value: columnValue
                    }),
                });
    
                if (res.ok) {
                    alert("Update" + column + " Success !")
                } else {
                    console.log("smth went wrong retreiving reviews");
                }
    
            } catch (error){
                console.log(error);                
            }
        }
    }

    const handleDelete = async() => {
        if (reviewId)
        try {
            const res = await fetch("http://localhost:1234/deleteReview", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    review_id: parseInt(Array.isArray(reviewId) ? reviewId[0].toString() : reviewId.toString()),
                    user_id: parseInt(user.id),
                }),
            });

            if (res.ok) {
                alert("Delete Success !")
                router.push("/userReviews")
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    if (review) {
        return (  
            <Theme>
                <div className={style.review_detail_container}>
                    <div className={style.title}>
                        <h1>Edit Review Detail</h1>
                    </div>
                    <div className={style.mid}>
                        <div className={style.header}>
                            <div className={style.left_header}>
                                <h2>{review.review_title}</h2>
                                <h3>{review.review_description}</h3>
                            </div>
                            <div className={style.right_header}>
                                <h3>{review.review_time}</h3>
                                <h3>on product {review.product_id}</h3>
                            </div>
                        </div>
                        <div className={style.details}>
                            <div className={style.details_block}>
                                <p>Helpful Count: {review.helpful_count}</p>
                            </div>
                            <div className={style.details_block}>
                                <p>Unhelpful Count: {review.unhelpful_count}</p>
                            </div>
                            <div className={style.details_block}>
                                <p>Rating: </p>
                                <select onChange={(e) => setRating(parseInt(e.target.value))}>
                                    <option value={review.rating}>{review.rating}</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <button onClick={(e) => handleUpdate("rating", rating)}>Update</button>
                            </div>
                            <div className={style.details_block}>
                                <p>On time delivery: </p>
                                <select onChange={(e) => setOnTimeDelivery(e.target.value)}>
                                    <option value={review.on_time_delivery}>{review.on_time_delivery}</option>
                                    <option value="yes">yes</option>
                                    <option value="no">no</option>
                                </select>
                                <button onClick={(e) => handleUpdate("on_time_delivery", onTimeDelivery)}>Update</button>
                            </div>
                            <div className={style.details_block}>
                                <p>Product Accuracy: </p>
                                <select onChange={(e) => setProductAccuracy(e.target.value)}>
                                    <option value={review.product_accuracy}>{review.product_accuracy}</option>
                                    <option value="yes">yes</option>
                                    <option value="no">no</option>
                                </select>
                                <button onClick={(e) => handleUpdate("product_accuracy", productAccuracy)}>Update</button>
                            </div>
                            <div className={style.details_block}>
                                <p>Service Satisfaction: </p>
                                <select onChange={(e) => setServiceSatisfaction(e.target.value)}>
                                    <option value={review.service_satisfaction}>{review.service_satisfaction}</option>
                                    <option value="yes">yes</option>
                                    <option value="no">no</option>
                                </select>
                                <button onClick={(e) => handleUpdate("service_satisfaction", serviceSatisfaction)}>Update</button>
                            </div>
                        </div>
                    </div>
                    <div className={style.bot}>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </Theme>
        );
    } else {
        return (  
            <Theme>
                <h1>Loading...</h1>
            </Theme>
        );
    }
}
 
export default ReviewDetail;