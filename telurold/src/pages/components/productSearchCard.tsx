import { Product } from "modules/authProvider";
import Image from "next/image";
import { useRouter } from "next/router";
import style from "../../styles/style.module.scss"

const ProductSearchCard = (props: {prod: Product}) => {

    const prod = props.prod
    const router = useRouter()

    return (  
        <div className={style.product_card_search_container} onClick={(e) => router.push("/product/" + prod.product_id)}>
            <img src={prod.product_image} style={{
                width: "30px",
                height: "30px"
            }}></img>

            <p>{prod.product_name}</p>
            <p>${prod.price}</p>
        </div>

    );
}
 
export default ProductSearchCard;