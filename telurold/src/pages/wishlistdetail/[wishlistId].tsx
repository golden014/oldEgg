import { AuthContext } from "modules/authProvider";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getWishlistById, getWishlistDetailss } from "../../hooks/wishlist"
import Theme from "../components/theme";
import style from "../../styles/style.module.scss"
import WishlistPublicCard from "../components/wishlistPublicCard";

const WishlistDetail = () => {

    const router = useRouter()
    const wishlistId = router.query.wishlistId
    const { user } = useContext(AuthContext)
    const { wishlistDetails, getWishlistDetails } = getWishlistDetailss()
    const { wishlist, getWishlist } = getWishlistById()


    useEffect(() => {
        if (typeof(wishlistId) == "string") {
            getWishlistDetails(parseInt(wishlistId))
            getWishlist(parseInt(wishlistId))
        }
    }, [wishlistId])

    //kalau ini milik user
    // if (wishlistDetails[0].user_id == parseInt(user.id)) {
    //     return (  
    
    //     );
    // }

    const addToCartHandler = async() => {
        if (wishlistId)
        try {
            const res = await fetch("http://localhost:1234/addAllItemToCart", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    wishlist_id: parseInt(Array.isArray(wishlistId) ? wishlistId[0].toString() : wishlistId.toString())                    ,
                    user_id: parseInt(user.id)
                }),
            });

            if (res.ok) {
                alert("Add all to cart success !")
                
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    if (wishlist) {
        console.log(wishlistDetails);
        
        return (
            <Theme>
                <div className={style.wishlist_detail_container}>
                    <div className={style.left}>
                        <h1>{wishlist?.wishlist_name}</h1>
                        <button onClick={addToCartHandler}>Add all item to cart</button>
                    </div>
                    <div className={style.right}>
                        {/* <div className={style.right_top}>
    
                        </div> */}
                        <div className={style.cart_details}>
                            <div className={style.cart_details_left}>
                                {wishlistDetails.map((wishlistDetail) => (
                                    <div className={style.cart_card_container}>
                                        <WishlistPublicCard cartProd={wishlistDetail} />
                                    </div>                        
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Theme>
        )
    } else {
        return (
            <h1>Loading...</h1>
        )
    }

}
 
export default WishlistDetail;