import { AuthContext, Wishlist } from "modules/authProvider";
import { useRouter } from "next/router";
import { useContext } from "react";
import style from "../../styles/style.module.scss"

const WishlistCardPublic = (props: {wishlist: Wishlist}) => {

    const wishlist = props.wishlist

    const { user } = useContext(AuthContext)
    
    const handleFollow = async() => {
      const getReviewsByProductId = async () => {
         try {
             const res = await fetch("http://localhost:1234/createNewFollow", {
                 method: "POST",
                 headers: {"Content-Type": "application/json;charset=utf-8"},
                 body: JSON.stringify({
                     wishlist_id: wishlist.wishlist_id,
                     user_id: parseInt(user.id)
                 }),
             });

             if (res.ok) {
                 alert("follow success !")
             } else {
                 console.log("smth went wrong retreiving reviews");
             }

         } catch (error){
             console.log(error);                
         }
     }

     getReviewsByProductId()
    }

    const router = useRouter()

    return (  
        <div className={style.wishlist_awikwok}>
                 <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                    }}>
                    <h2 onClick={(e) => router.push("/wishlistdetail/" + wishlist.wishlist_id)}>{wishlist.wishlist_name}</h2>
                    <p>({wishlist.status})</p>
                 </div>
                 <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                 }}>
                    <button style={{backgroundColor: "#1946B8"}} onClick={handleFollow}>Follow</button>
                    <button style={{backgroundColor: "#1946B8"}} >Duplicate</button>
                 </div>
            </div>
    );
}
 
export default WishlistCardPublic;