import { Store } from "modules/authProvider";
import style from "../../styles/style.module.scss"

const StoreCard = (props: {store: Store}) => {
    const category = props.store
    return (  
        <div className={style.category_card_container}>
            <button>{category.store_name}</button>
        </div>
    );
}
 
export default StoreCard;