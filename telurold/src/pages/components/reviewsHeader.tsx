import style from "../../styles/style.module.scss"
import { useState, useEffect } from "react"

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
            </div>
            <div className={style.mid}>
                <p>5 star: {fiveStar}</p>
                <p>4 star: {fourStar}</p>
                <p>3 star: {threeStar}</p>
                <p>2 star: {twoStar}</p>
                <p>1 star: {oneStar}</p>
            </div>
            <div className={style.right}>
                <p>On Time Delivery: {onTimeDelivery}%</p>
                <p>Product Accuracy: {productAccuracy}%</p>
                <p>Service Satisfaction: {serviceSatisfaction}%</p>
            </div>
            
        </div>
    );
}
 
export default ReviewHeader;