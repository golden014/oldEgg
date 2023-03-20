import style from "../styles/style.module.scss"
import Theme from "./components/theme";
import { useState, useContext, useEffect } from "react"
import { AuthContext, Review } from "modules/authProvider";
import ReviewCard from "./components/reviewCard";
import ReviewCardOwn from "./components/reviewCardOwn";

const UserReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([])
    const { user } = useContext(AuthContext)

    //ambil smua data reviews dari yg dibuat user
    useEffect(() => {
        if (user) {
            const getReviewsByProductId = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getReviewByUserId", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            user_id: parseInt(user.id)
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
        }
    }, [user])

    return (  
        <Theme>
            {reviews.map((review) => (
                <ReviewCardOwn review={review}/>
            ))}
        </Theme>
    );
}
 
export default UserReviews;