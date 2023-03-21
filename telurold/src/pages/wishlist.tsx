import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useState, useEffect, useContext } from "react"
import { AuthContext, Wishlist } from "modules/authProvider";
import WishlistModal from "./components/wishlistModal";

const Wishlist = () => {

    const [wishlists, setWishlists] = useState<Wishlist[]>([])
    const { user } = useContext(AuthContext)

    const [newName, setNewName] = useState("")
    const [newStatus, setNewStatus] = useState("public")

    const handleAdd = async() => {
        if (user) {
            try {
                const res = await fetch("http://localhost:1234/createNewWishlist", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        wishlist_name: newName,
                        user_id: parseInt(user.id),
                        status: newStatus
                    }),
                });
    
                if (res.ok) {
                    alert("Create New Wishlist Success")
                    window.location = window.location
                } else {
                    console.log("smth went wrong retreiving reviews");
                }
    
            } catch (error){
                console.log(error);                
            }
        }
    }

    //useeffect get all wishlist owned by user
    useEffect(() => {
        if (user) {
            const getReviewsByProductId = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getWishlistByUserId", {
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
                        <h1>Wishlist</h1>
                    </div>
                    <div className={style.addresses_container}>
                        <div className={style.address_card}>
                            <div style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <h2>Add New Wishlist</h2>
                            </div>
                            <input type="text" placeholder="New Wishlist's Name" onChange={(e) => setNewName(e.target.value)}/>
                            <div>
                                <select onChange={(e) => setNewStatus(e.target.value)}>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <button style={{backgroundColor: "#050c2e"}} onClick={handleAdd}>
                                Add
                            </button>
                        </div>
                        {wishlists.map((wishlist) => {
                            
                            return (
                                <div className={style.address_card}>
                                    <WishlistModal wishlist={wishlist}/>
                                </div>
                            )
                        })}
                    </div>
            </div>
        </Theme>
    );
}
 
export default Wishlist;