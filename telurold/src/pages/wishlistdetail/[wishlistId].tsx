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

    if (wishlist) {
        console.log(wishlistDetails);
        
        return (
            <Theme>
                <div className={style.wishlist_detail_container}>
                    <div className={style.left}>
                        <h1>{wishlist?.wishlist_name}</h1>
                        <button>Add all item to cart</button>
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