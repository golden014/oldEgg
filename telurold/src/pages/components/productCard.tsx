import { Product } from "modules/authProvider";
import { useState } from "react";
import style from "../../styles/style.module.scss"
import QuickView from "./quickView";

const ProductCard = (props: {product: Product}) => {
    const prod = props.product

    const [quickViewProd, setQuickViewProd] = useState<Product>()

    const handleQuickView =() => {
        <QuickView prod_id={prod.product_id} />
    }

    return (  
        <div className={style.product_card_container}>
            <img src={prod.product_image} style={{
                width: "150px", 
                height: "150px",
                objectFit: "cover"
            }} />
            <h2>{prod.product_name}</h2>
            <h3>${prod.price} </h3>
            <div className={style.product_card_quick_view}>
                <button onClick={handleQuickView}>quick view</button>
            </div>

            <div className={style.product_card_quickView}>
                
            </div>
        </div>
    );
}
 
export default ProductCard;