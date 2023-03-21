import { Wishlist } from "modules/authProvider";
import style from "../../styles/style.module.scss"

const WishlistCardPublic = (props: {wishlist: Wishlist}) => {

    const wishlist = props.wishlist

    return (  
        <div className={style.wishlist_awikwok}>
                 <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                    }}>
                    <h2>{wishlist.wishlist_name}</h2>
                    <p>({wishlist.status})</p>
                 </div>
                 <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                 }}>
                    <button style={{backgroundColor: "#1946B8"}} >Follow</button>
                    <button style={{backgroundColor: "#1946B8"}} >Duplicate</button>
                 </div>
            </div>
    );
}
 
export default WishlistCardPublic;