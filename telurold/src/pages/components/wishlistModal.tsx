import { AuthContext, Wishlist } from "modules/authProvider";
import { useState, useContext } from "react";
import style from "../../styles/style.module.scss"

const WishlistModal = (props: {wishlist: Wishlist}) => {

    const { user } = useContext(AuthContext)
    const wishlist = props.wishlist
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
    const [show, setShow] = useState(false)
    const [newStatus, setNewStatus] = useState(props.wishlist.status)
    const [newName, setNewName] = useState(props.wishlist.wishlist_name)

    if (show) {
        return (
            <div>
                <div className={style.wishlist_modal_container}>
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
                <h2>{wishlist.wishlist_name}</h2>
                <button style={{backgroundColor: "#1946B8"}} onClick={(e) => setShow(!show)}>Update</button>
            </div>
        );
    } else {
        return (
            <div>
                 <h2>{wishlist.wishlist_name}</h2>
                 <button style={{backgroundColor: "#1946B8"}} onClick={(e) => setShow(!show)}>Update</button>
            </div>
        )
    }
}
 
export default WishlistModal;