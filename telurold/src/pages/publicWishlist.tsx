import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useState, useEffect, useContext } from "react"
import { Wishlist } from "modules/authProvider";
import WishlistModal from "./components/wishlistModal";
import { useRouter } from "next/router";
import WishlistCardPublic from "./components/wishlistCardPublic";
import Space from "./components/space";

const PublicWishlist = () => {

    const [wishlists, setWishlists] = useState<Wishlist[]>([])
    const [sort, setSort] = useState("")
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [itemPerPage, setItemPerPage] = useState(3)
    const [tempNum, setTempNum] = useState(3)

    useEffect(() => {
        const getReviewsByProductId = async () => {
            try {
                const res = await fetch("http://localhost:1234/paginateWishlist", {
                    method: "POST",
                    headers: {"Content-Type": "application/json;charset=utf-8"},
                    body: JSON.stringify({
                        page: page,
                        page_size: itemPerPage
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
    }, [itemPerPage, page])

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
        } else {

        }
    }

    return (  
        <Theme>
             <div className={style.cart_page_container}>
                <div className={style.title}>
                    <br />
                    <h1>Public Wishlist</h1>
                    <button onClick={(e) => router.push("/wishlist")}>Your Wishlist</button>
                </div>
                <div className={style.addresses_container}>
                    <div className={style.address_card}>
                        <div className={style.public_wishlist_detail}>
                            <p>Sort By</p>
                            <select onChange={(e) => setSort(e.target.value)}>
                                <option value=""></option>
                                <option value="">Rating</option>
                                <option value="">Created Date</option>
                                <option value="">Reviews</option>
                                <option value="price">Price</option>
                                <option value="followers">Followers</option>
                            </select>
                        </div>
                        <div className={style.public_wishlist_detail}>
                            <div className={style.detail_left}>
                                <p>Wishlists per page</p>
                                <input type="number" onChange={(e) => setTempNum(parseInt(e.target.value))}/>
                                <button onClick={(e) => setItemPerPage(tempNum)}>Apply</button>
                            </div>
                            <div className={style.detail_right}>
                                <button onClick={prevPage}>Prev</button>
                                <button onClick={nextPage}>Next</button>
                            </div>
                        </div>
                    </div>
                    {wishlists.map((wishlist) => {
                        return (
                            <div className={style.address_card}>
                                <WishlistCardPublic wishlist={wishlist}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Space/>
        </Theme>
    );
}
 
export default PublicWishlist;