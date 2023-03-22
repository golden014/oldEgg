import { WishlistDetails } from "modules/authProvider"
import { useState } from "react"

export function getWishlistDetails() {

    const [wishlistDetails, setWishlistDetails] = useState<WishlistDetails[]>([])

    const getWishlistDetails = async(wishlist_id: number) => {
        try {
            const res = await fetch("http://localhost:1234/getReviewByProductId", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    wishlist_id: wishlist_id
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setWishlistDetails(data)
                
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    return { wishlistDetails, getWishlistDetails }
}