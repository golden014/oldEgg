import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useState, useEffect, useContext } from "react"
import { AuthContext, Wishlist } from "modules/authProvider";
import WishlistModal from "./components/wishlistModal";
import { useRouter } from "next/router";
import WishlistCardPublic from "./components/wishlistCardPublic";
import WishlistCardFollowed from "./components/wishlistCardFollowed";
import Space from "./components/space";

const FollowedWishlist = () => {
    const [wishlists, setWishlists] = useState<Wishlist[]>([])
    const router = useRouter()

    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (user) {
            const getReviewsByProductId = async () => {
                try {
                    const res = await fetch("http://localhost:1234/viewAllFollowed", {
                        method: "POST",
                        headers: {"Content-Type": "application/json;charset=utf-8"},
                        body: JSON.stringify({
                            user_id: parseInt(user.id)
                        }),
                    });
    
                    if (res.ok) {
                        const data = await res.json();
                        setWishlists(data)
    
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
             <div className={style.cart_page_container}>
                <div className={style.title}>
                    <br />
                    <h1>Followed Wishlist</h1>
                    <button onClick={(e) => router.push("/wishlist")}>Your Wishlist</button>
                    <button onClick={(e) => router.push("/publicWishlist")}>Public Wishlist</button>
                </div>
                <div className={style.addresses_container}>
                   

                    {wishlists.map((wishlist) => {
                        return (
                            <div className={style.address_card}>
                                <WishlistCardFollowed wishlist={wishlist}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Space/>
        </Theme>
    );
}
 
export default FollowedWishlist;