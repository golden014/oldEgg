import { Product } from "modules/authProvider";
import style from "../../styles/style.module.scss"
import ProductSearchCard from "./productSearchCard";

const PopUpSearch = (props: {products: Product[]}) => {

    const prods = props.products
    if (prods.length == 0) {
        return (
            <div>

            </div>
        )
    } else {
        return (  
            <div className={style.pop_up_search}>
                {/* //walaupun hasil query bisa banyak, tar dia nampilin hanya 5
                //item, nnti wktu di enter baru dishow all */}
                {prods.slice(0, 5).map((prod) => (
                    <ProductSearchCard prod={prod} />
                ))}
            </div>
            
         );
    }
}
 
export default PopUpSearch;