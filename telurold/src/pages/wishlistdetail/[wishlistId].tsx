import { AuthContext } from "modules/authProvider";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getWishlistById, getWishlistDetailss } from "../../hooks/wishlist"
import Theme from "../components/theme";
import style from "../../styles/style.module.scss"
import WishlistPublicCard from "../components/wishlistPublicCard";
import WishlistOwnCard from "../components/wishlistOwnCard";

const WishlistDetail = () => {

    const router = useRouter()
    const wishlistId = router.query.wishlistId
    const { user } = useContext(AuthContext)
    const { wishlistDetails, getWishlistDetails } = getWishlistDetailss()
    const { wishlist, getWishlist } = getWishlistById()

    // const [show, setShow] = useState(false)
    const [newStatus, setNewStatus] = useState("")
    const [newName, setNewName] = useState("")

    useEffect(() => {
        if (wishlist) {
            setNewName(wishlist.wishlist_name)
            setNewStatus(wishlist.status)
        }
    }, [wishlist])

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

    const handleUpdate = async(column: string, newValue: string) => {
        if (wishlist) {
            try {
                const res = await fetch("http://localhost:1234/updateWishlistById", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        wishlist_id: wishlist.wishlist_id,
                        user_id: parseInt(user.id),
                        column: column,
                        new_value: newValue
                    }),
                });
    
                if (res.ok) {
                    alert("Update" + column + " Success !")
                    window.location = window.location
                } else {
                    console.log("smth went wrong retreiving reviews");
                }
    
            } catch (error){
                console.log(error);                
            }
        }
    }

    if (wishlist) {
        console.log(wishlistDetails);
        //kalau bukan punya user
        if (wishlist.user_id != parseInt(user.id)) {
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
        } 
        //kalau punya user
        else {
            

            return (
                <Theme>
                    <div className={style.wishlist_detail_container}>
                        <div className={style.left}>
                            <h1>{wishlist?.wishlist_name}</h1>
                            <h2>({wishlist.status})</h2>
                            <button onClick={addToCartHandler}>Add all item to cart</button>
                            <div>
                                <input type="text" placeholder="Updated Wishlist's Name"  onChange={(e) => setNewName(e.target.value)}/>
                                <button style={{backgroundColor: "#1946B8"}} onClick={(e) => handleUpdate("wishlist_name", newName)}>Update Name</button>
                                <div>
                                    <p>Privacy</p>
                                    <select onChange={(e) => setNewStatus(e.target.value)}>
                                        <option value={wishlist.status}> </option>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                                <button style={{backgroundColor: "#1946B8"}} onClick={(e) => handleUpdate("status", newStatus)}>Update Privacy</button>
                            </div>
                        </div>
                        <div className={style.right}>
                            {/* <div className={style.right_top}>
        
                            </div> */}
                            <div className={style.cart_details}>
                                <div className={style.cart_details_left}>
                                    {wishlistDetails.map((wishlistDetail) => (
                                        <div className={style.cart_card_container}>
                                            <WishlistOwnCard cartProd={wishlistDetail} />
                                        </div>                        
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Theme>
            )
        }
    } else {
        return (
            <h1>Loading...</h1>
        )
    }

}
 
export default WishlistDetail;