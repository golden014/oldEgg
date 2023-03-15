import style from "../../styles/style.module.scss"
import { useState, useEffect } from "react"
import Rating from "./rating"

const ReviewHeader = (props: {store_id: any, filter: any}) => {
    const [totalReviews, setTotalReviews] = useState(0)
    const [fiveStar, setFiveStar] = useState(0)
    const [fourStar, setFourStar] = useState(0)
    const [threeStar, setThreeStar] = useState(0)
    const [twoStar, setTwoStar] = useState(0)
    const [oneStar, setOneStar] = useState(0)
    const [onTimeDelivery, setOnTimeDelivery] = useState(0.0)
    const [productAccuracy, setProductAccuracy] = useState(0.0)
    const [serviceSatisfaction, setServiceSatisfaction] = useState(0.0)

    useEffect(() => {
        const getStat = async() => {
            try {
                const res = await fetch("http://localhost:1234/getReviewStatsByStoreId", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        store_id: props.store_id,
                        filter: props.filter
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setTotalReviews(data.total_review)
                    setFiveStar(data.five_star)
                    setFourStar(data.four_star)
                    setThreeStar(data.three_star)
                    setTwoStar(data.two_star)
                    setOneStar(data.one_star)
                    setOnTimeDelivery(data.on_time_delivery)
                    setProductAccuracy(data.product_accuracy)
                    setServiceSatisfaction(data.service_satisfaction)
                    
                } else {
                    console.log("smth went wrong retreiving reviews");
                }
            } catch (error) {
                console.log(error);
            }
        }

        getStat();
    }, [props.filter])

    return (  
        <div className={style.reviews_header_container}>
            <div className={style.left}>
                <h2>Total reviews {totalReviews}</h2>
                <h2>Average rating: {((fiveStar*5) + (fourStar*4) + (threeStar*3) + (twoStar*2) + (oneStar*1))/totalReviews}</h2>
            </div>
            <div className={style.mid}>

                <div className={style.progress_bar}>
                    <p>5 star</p>
                    <Rating rating={5}/> 
                    <progress value={fiveStar} max={totalReviews}> </progress>
                    <p>{fiveStar}</p>
                </div>

                <div className={style.progress_bar}>
                    <p>4 star</p>
                    <Rating rating={4}/> 
                    <progress value={fourStar} max={totalReviews}> </progress>
                    <p>{fourStar} </p>
                </div>

                <div className={style.progress_bar}>
                    <p>3 star</p>
                    <Rating rating={3}/>
                    <progress value={threeStar} max={totalReviews}> </progress>
                    <p>{threeStar} </p>
                </div>

                <div className={style.progress_bar}>
                    <p>2 star</p>
                    <Rating rating={2}/>
                    <progress value={twoStar} max={totalReviews}> </progress>
                    <p>{twoStar} </p>
                </div>

                <div className={style.progress_bar}>
                    <p>1 star </p>
                    <Rating rating={1}/>
                    <progress value={oneStar} max={totalReviews}> </progress>
                    <p>{oneStar}</p>
                </div>
            </div>
            <div className={style.right}>
                <div className={style.progress_bar}>
                    <p>On Time Delivery: {onTimeDelivery}%</p>
                    <progress value={onTimeDelivery} max={100}> </progress>
                </div>
                <div className={style.progress_bar}>
                    <p>Product Accuracy: {productAccuracy}%</p>
                    <progress value={productAccuracy} max={100}> </progress>
                </div>
                <div className={style.progress_bar}>
                    <p>Service Satisfaction: {serviceSatisfaction}%</p>
                    <progress value={serviceSatisfaction} max={100}> </progress>
                </div>
            </div>
            
        </div>
    );
}
 
export default ReviewHeader;