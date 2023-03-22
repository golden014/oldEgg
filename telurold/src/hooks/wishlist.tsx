import { Wishlist, WishlistDetails } from "modules/authProvider"
import { useState, useEffect } from "react"

export function getWishlistDetailss() {

    const [wishlistDetails, setWishlistDetail] = useState<WishlistDetails[]>([])

    const getWishlistDetails = async(wishlist_id: number) => {
        console.log(wishlist_id);
        
        try {
            const res = await fetch("http://localhost:1234/getWishlistDetails", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    wishlist_id: wishlist_id
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setWishlistDetail(data)
                
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }

    return { wishlistDetails, getWishlistDetails }
}

export function getWishlistById() {
    const [wishlist, setWishlist] = useState<Wishlist>()

    const getWishlist = async(wishlist_id: number) => {
        try {
            const res = await fetch("http://localhost:1234/getWishlistById", {
                method: "POST",
                headers: {"Content-Type": "application/json;charset=utf-8"},
                body: JSON.stringify({
                    wishlist_id: wishlist_id
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setWishlist(data)
                
            } else {
                console.log("smth went wrong retreiving reviews");
            }

        } catch (error){
            console.log(error);                
        }
    }


    return { wishlist, getWishlist }
}