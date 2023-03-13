import { Review, UserInfo } from "modules/authProvider";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"

const ReviewCard = (props: {review:Review}) => {
    
    const [user, setUser] = useState<UserInfo>() 
    const review = props.review

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

    return (  
        <div className={style.review_card_container}>
            <div className={style.review_card_left}>
                <h2>{user?.firstname} {user?.lastname}</h2>
            </div>

            <div className={style.review_card_right}>
                <h2>Right</h2>
            </div>
        </div>
    );
}
 
export default ReviewCard;