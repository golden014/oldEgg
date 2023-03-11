import { Product } from "modules/authProvider";
import { useRouter } from "next/router";
import { useState } from "react";
import style from "../../styles/style.module.scss"
import QuickView from "./quickView";

const ProductCard = (props: {product: Product}) => {
    const prod = props.product
    const router = useRouter()
    const [quickViewProd, setQuickViewProd] = useState<Product>()
    const [showView, setShowView] = useState(false)

    const handleQuickView =() => {
        setShowView(!showView)
    }

    return (  
        <div className={style.product_card_container}>
            <img src={prod.product_image} style={{
                width: "150px", 
                height: "150px",
                objectFit: "cover"
            }} />
            <h2 onClick={(e) => router.push("/product/" + prod.product_id)}>{prod.product_name}</h2>
            <br />
            <h3>${prod.price} </h3>
            <div className={style.product_card_quick_view}>
                <button onClick={handleQuickView}>quick view</button>
            </div>

           {
            showView && 
            <div className={style.quick_view_pop_up}>
                <QuickView prod_id={prod.product_id} />
            </div>
           }
        </div>
    );
}
 
export default ProductCard;